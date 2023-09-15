import express from "express";
import { Groups, Roles, checkGroup } from "../middlewares/check-group";
import { createConsultant, getConsultant } from "../helpers/consultants";
import { handleError, isValidEmail } from "../utils";
import { StatusCodes } from "../utils/status-codes";
import { InvalidEmailError } from "../utils/errors/auth";
import {
  createUser,
  generatePasswordResetLink,
  setRole,
} from "../helpers/auth";
import { generateTemplate } from "../utils/mailing/generate-template";
import { sendEmail } from "../helpers/mailer";
import { generateObjectId } from "../utils/generate-string";

const router = express.Router();

router.get("/", checkGroup(Groups.ADMINS_OR_MANAGERS), (req, res) => {
  res.send("Hello Consultants!");
});
router.get("/:id", checkGroup(Groups.ADMINS_OR_MANAGERS), async (req, res) => {
  try {
    const { id } = req.params;
    const { populate } = req.query;
    const options = {};
    if (typeof populate === "string") {
      options["populate"] = populate;
    }
    const result = await getConsultant(id, {
      ...options,
    });
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
router.post("/", checkGroup(Groups.MANAGERS), async (req, res) => {
  try {
    const { user: manager, body, query } = req;
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
      manager: manager.uid,
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
