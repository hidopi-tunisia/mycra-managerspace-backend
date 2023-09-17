import { Router } from "express";
import {
  createUser,
  generatePasswordResetLink,
  setRole,
} from "../helpers/auth";
import { createConsultant, getConsultant } from "../helpers/consultants";
import { sendEmail } from "../helpers/mailer";
import { Groups, Roles, checkGroup } from "../middlewares/check-group";
import { handleError, isValidEmail } from "../utils";
import { InvalidEmailError } from "../utils/errors/auth";
import { generateObjectId } from "../utils/generate-string";
import { generateTemplate } from "../utils/mailing/generate-template";
import { StatusCodes } from "../utils/status-codes";

const router = Router();

router.get("/", checkGroup(Groups.ADMINS_OR_SUPERVISORS), (req, res) => {
  res.send("Hello Consultants!");
});
router.get("/:id", checkGroup(Groups.ADMINS_OR_SUPERVISORS), async (req, res) => {
  try {
    const { id } = req.params;
    const { populate } = req.query;
    const options = {};
    if (typeof populate === "string") {
      options["populate"] = populate;
    }
    if (typeof count === "string") {
      options["count"] = count;
    }
    const result = await getConsultant(id, {
      ...options,
    });
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
router.post("/", checkGroup(Groups.SUPERVISORS), async (req, res) => {
  try {
    const { user: supervisor, body, query } = req;
    if (!body.email || !isValidEmail(body.email)) {
      throw new InvalidEmailError();
    }
    const uid = generateObjectId().toString();
    const user = await createUser({ uid, email: body.email });
    await setRole(user.uid, Roles.CONSULTANT);
    if (query.send_email !== "false") {
      const link = await generatePasswordResetLink(body.email);
      const html = await generateTemplate("consultant_reset-password", {
        EMAIL: body.email,
        LINK: link,
      });
      const payload = {
        to: req.body.email,
        subject: "Reset your password",
        html,
      };
      await sendEmail(payload);
    }
    const result = await createConsultant({
      ...body,
      _id: user.uid,
      supervisor: supervisor.uid,
    });
    res.status(StatusCodes.CREATED).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
router.put("/:id", (req, res) => {
  res.send("Got a PUT request at :id");
});
router.delete("/:id", (req, res) => {
  res.send("Got a DELETE request at /user");
});

export default router;
