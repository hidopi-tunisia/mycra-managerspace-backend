import { Router } from "express";
import {
  createUser,
  generatePasswordResetLink,
  setRole,
} from "../helpers/auth";
import { sendEmail } from "../helpers/mailer";
import { assignSupervisorToClient, createSupervisor, getSupervisor } from "../helpers/supervisors";
import {
  assignOfferToSupervisor,
  unassignOfferFromSupervisor,
} from "../helpers/offers";
import { Groups, Roles, checkGroup } from "../middlewares/check-group";
import { handleError, isValidEmail } from "../utils";
import { generateObjectId } from "../utils/generate-string";
import { generateTemplate } from "../utils/mailing/generate-template";
import { StatusCodes } from "../utils/status-codes";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello Supervisors!");
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
    if (query.send_email !== "false") {
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
        params.clientId,
      );
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);
router.put("/:id", (req, res) => {
  res.send("Got a PUT request at :id");
});
router.delete("/:id", (req, res) => {
  res.send("Got a DELETE request at /user");
});

export default router;
