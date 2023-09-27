import { Router } from "express";
import {
  createUser,
  generatePasswordResetLink,
  setRole,
} from "../helpers/auth";
import {
  createConsultant,
  deleteConsultant,
  getConsultant,
} from "../helpers/consultants";
import { sendEmail } from "../helpers/mailer";
import { Groups, Roles, checkGroup } from "../middlewares/check-group";
import { handleError, isValidEmail } from "../utils";
import { ForbiddenError, InvalidEmailError } from "../utils/errors/auth";
import { generateObjectId } from "../utils/generate-string";
import { generateTemplate } from "../utils/mailing/generate-template";
import { StatusCodes } from "../utils/status-codes";

const router = Router();

router.get("/", checkGroup(Groups.ADMINS_OR_SUPERVISORS), (req, res) => {
  res.send("Hello Consultants!");
});
router.get(
  "/:id",
  checkGroup(Groups.ADMINS_OR_SUPERVISORS),
  async (req, res) => {
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
  }
);
router.post("/", checkGroup(Groups.SUPERVISORS), async (req, res) => {
  try {
    const { user: supervisor, body, query } = req;
    if (!body.email || !isValidEmail(body.email)) {
      throw new InvalidEmailError();
    }
    const email = body.email.toLowerCase();
    const uid = generateObjectId().toString();
    const user = await createUser({ uid, email });
    await setRole(user.uid, Roles.CONSULTANT);
    if (query.send_email !== "false") {
      const link = await generatePasswordResetLink(email);
      const html = await generateTemplate("consultant_reset-password", {
        EMAIL: email,
        LINK: link,
      });
      const payload = {
        to: email,
        subject: "Reset your password",
        html,
      };
      await sendEmail(payload);
    }
    const result = await createConsultant({
      ...body,
      email,
      _id: user.uid,
      supervisor: supervisor.uid,
    });
    res.status(StatusCodes.CREATED).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
router.delete(
  "/:id",
  checkGroup(Groups.ADMINS_OR_SUPERVISORS),
  async (req, res) => {
    try {
      const { user, params, query } = req;
      const consultant = await getConsultant(params.id);
      if (
        user.role === Roles.SUPERVISOR &&
        !consultant.supervisor.equals(user.uid)
      ) {
        throw new ForbiddenError();
      }
      let keepIdentity = false;
      if (query["keep-identity"] === "true") {
        keepIdentity = true;
      }
      const result = await deleteConsultant(params.id, { keepIdentity });
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);
export default router;
