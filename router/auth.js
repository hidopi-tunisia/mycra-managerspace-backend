import {
  createUser,
  generatePasswordResetLink,
  setRole,
} from "../helpers/auth";
import { sendEmail } from "../helpers/mailer";
import { Groups, Roles, checkGroup } from "../middlewares/check-group";
import { handleError, isValidEmail } from "../utils";
import { InvalidEmailError, InvalidRoleError } from "../utils/errors/auth";
import { generateTemplate } from "../utils/mailing/generate-template";
import { StatusCodes } from "../utils/status-codes";

const router = Router();

router.post("/admins", checkGroup(Groups.ADMINS), async (req, res) => {
  try {
    const { body, query } = req;
    if (!body.email || !isValidEmail(body.email)) {
      throw new InvalidEmailError();
    }
    const user = await createUser(body);
    await setRole(user.uid, Roles.ADMIN);
    if (query.send_email !== "false") {
      const link = await generatePasswordResetLink(body.email);
      const html = await generateTemplate("welcome_admin", {
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
    res.status(StatusCodes.CREATED).send(user);
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
