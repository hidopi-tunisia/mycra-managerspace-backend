import { Router } from "express";
import {
  createUser,
  generatePasswordResetLink,
  setRole,
} from "../helpers/auth.js";
import {
  createConsultant,
  deleteConsultant,
  getConsultant,
} from "../helpers/consultants.js";
import { sendEmail } from "../helpers/mailer.js";
import { Groups, Roles, checkGroup } from "../middlewares/check-group.js";
import { handleError, isValidEmail } from "../utils/index.js";
import { ForbiddenError, InvalidEmailError } from "../utils/errors/auth.js";
import { generateObjectId } from "../utils/generate-string.js";
import { generateTemplate } from "../utils/mailing/generate-template.js";
import { StatusCodes } from "../utils/status-codes.js";

const router = Router();

router.get("/", checkGroup(Groups.ADMINS), async (req, res) => {
  try {
    const {
      page,
      limit,
      sort,
      status,
      fname,
      lname,
      email,
      "created-at-min": camin,
      "created-at-max": camax,
      populate,
    } = req.query;
    const options = {};
    if (!isNaN(page) && page >= 0) {
      options["page"] = page;
    }
    if (!isNaN(limit) && limit > 0) {
      options["limit"] = limit;
    }
    if (sort === "asc" || sort === "desc") {
      options["sort"] = sort;
    }
    if (typeof status === "string") {
      options["status"] = status;
    }
    if (typeof fname === "string") {
      options["firstName"] = fname;
    }
    if (typeof lname === "string") {
      options["lastName"] = lname;
    }
    if (typeof email === "string") {
      options["email"] = email;
    }
    if (typeof camin === "string") {
      options["createdAtMin"] = camin;
    }
    if (typeof camax === "string") {
      options["createdAtMax"] = camax;
    }
    if (typeof populate === "string") {
      options["populate"] = populate;
    }
    const result = await getConsultant(options);
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
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
