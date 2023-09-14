import express from "express";
import { Groups, Roles, checkGroup } from "../middlewares/check-group";
import { createManager, getManager } from "../helpers/managers";
import { handleError, isValidEmail } from "../utils";
import { StatusCodes } from "../utils/status-codes";
import {
  createUser,
  generatePasswordResetLink,
  setRole,
} from "../helpers/auth";
import { generateTemplate } from "../utils/mailing/generate-template";
import { sendEmail } from "../helpers/mailer";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello Managers!");
});
router.get("/:id", checkGroup(Groups.ADMINS), async (req, res) => {
  try {
    const { id } = req.params;
    const { join } = req.query;
    const options = {};
    if (typeof join === "string") {
      options["join"] = join;
    }
    const result = await getManager(id, {
      ...options,
    });
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
router.post("/", checkGroup(Groups.ADMINS), async (req, res) => {
  try {
    const { body, query } = req;
    if (!body.email || !isValidEmail(body.email)) {
      throw new InvalidEmailError();
    }
    const user = await createUser({ email: body.email });
    await setRole(user.uid, Roles.MANAGER);
    if (query.send_email !== "false") {
      const link = await generatePasswordResetLink(body.email);
      const html = await generateTemplate("manager_reset-password", {
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
    const result = await createManager({ ...body, _id: user.uid });
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
