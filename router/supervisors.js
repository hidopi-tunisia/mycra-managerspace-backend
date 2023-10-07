import { Router } from "express";
import {
  createUser,
  generatePasswordResetLink,
  setRole,
} from "../helpers/auth.js";
import { sendEmail } from "../helpers/mailer.js";
import {
  assignSupervisorToClient,
  createSupervisor,
  deleteSupervisor,
  getSupervisor,
  getSupervisors,
  updateSupervisor,
} from "../helpers/supervisors.js";
import {
  assignOfferToSupervisor,
  unassignOfferFromSupervisor,
} from "../helpers/offers.js";
import { Groups, Roles, checkGroup } from "../middlewares/check-group.js";
import { handleError, isValidEmail } from "../utils/index.js";
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
      offer,
      status,
      city,
      siret,
      street,
      "company-name": companyName,
      "zip-code": zipCode,
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
    if (typeof offer === "string") {
      options["offer"] = offer;
    }
    if (typeof status === "string") {
      options["status"] = status;
    }
    if (typeof companyName === "string") {
      options["companyName"] = companyName;
    }
    if (typeof siret === "string") {
      options["siret"] = siret;
    }
    if (typeof street === "string") {
      options["street"] = street;
    }
    if (typeof city === "string") {
      options["city"] = city;
    }
    if (typeof zipCode === "string") {
      options["zipCode"] = zipCode;
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
    const result = await getSupervisors(options);
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
router.get("/:id", checkGroup(Groups.ADMINS), async (req, res) => {
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
    const result = await getSupervisor(id, {
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
    const uid = generateObjectId().toString();
    const user = await createUser({ uid, email: body.email });
    await setRole(uid, Roles.SUPERVISOR);
    if (query["send-email"] !== "false") {
      const link = await generatePasswordResetLink(body.email);
      const html = await generateTemplate("supervisor_reset-password", {
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
    const result = await createSupervisor({ ...body, _id: user.uid });
    res.status(StatusCodes.CREATED).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});

// Assign an offer to a supervisor
router.patch(
  "/:supervisorId/offer/:offerId/assign",
  checkGroup(Groups.ADMINS),
  async (req, res) => {
    try {
      const { params } = req;
      const result = await assignOfferToSupervisor(
        params.offerId,
        params.supervisorId
      );
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);

// Unassign an offer from a supervisor
router.patch(
  "/:supervisorId/offer/:offerId/unassign",
  checkGroup(Groups.ADMINS),
  async (req, res) => {
    try {
      const { params } = req;
      const result = await unassignOfferFromSupervisor(params.supervisorId);
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);

// Assign a supervisor to a client
router.patch(
  "/:supervisorId/client/:clientId/assign",
  checkGroup(Groups.ADMINS),
  async (req, res) => {
    try {
      const { params } = req;
      const result = await assignSupervisorToClient(
        params.supervisorId,
        params.clientId
      );
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);
router.put("/:id", checkGroup(Groups.ADMINS), async (req, res) => {
  try {
    const { body, params } = req;
    const result = await updateSupervisor(params.id, { ...body });
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
router.delete("/:id", checkGroup(Groups.ADMINS), async (req, res) => {
  try {
    const { params, query } = req;
    let keepIdentity = false;
    if (query["keep-identity"] === "true") {
      keepIdentity = true;
    }
    const result = await deleteSupervisor(params.id, { keepIdentity });
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});

export default router;
