import express from "express";
import { Groups, Roles, checkGroup } from "../middlewares/check-group";
import {
  createAdmin,
  generatePasswordResetLink,
  setRole,
} from "../helpers/admins";
import { handleError, isValidEmail } from "../utils";
import { InvalidEmailError, InvalidRoleError } from "../utils/errors/auth";
import { generateTemplate } from "../utils/mailing/generate-template";
import { sendEmail } from "../helpers/mailer";
import { StatusCodes } from "../utils/status-codes";

const router = express.Router();

router.post("/", checkGroup(Groups.ADMINS), async (req, res) => {
  try {
    const { body } = req;
    if (!body.email || !isValidEmail(body.email)) {
      throw new InvalidEmailError();
    }
    const user = await createAdmin(body);
    const result = await setRole(user.uid, Roles.ADMIN);
    const link = await generatePasswordResetLink(body.email);
    const payload = {
      to: req.body.email,
      subject: "Reset your password",
      html: generateTemplate({ email: body.email, link }),
    };
    const response = await sendEmail(payload);
    console.log(response);
    res.status(StatusCodes.CREATED).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});

router.patch("/:id/role", checkGroup(Groups.ADMINS), async (req, res) => {
  try {
    const {
      body: { role },
      params: { id },
    } = req;
    if (!role || !Object.values(Roles).includes(role)) {
      throw new InvalidRoleError();
    }
    const result = await setRole(id, role);
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});

export default router;
