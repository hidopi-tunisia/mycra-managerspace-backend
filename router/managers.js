import { Router } from "express";
import {
  createUser,
  generatePasswordResetLink,
  setRole,
} from "../helpers/auth";
import { sendEmail } from "../helpers/mailer";
import { assignManagerToClient, createManager, getManager } from "../helpers/managers";
import {
  affectOfferToManager,
  unaffectOfferFromManager,
} from "../helpers/offers";
import { Groups, Roles, checkGroup } from "../middlewares/check-group";
import { handleError, isValidEmail } from "../utils";
import { generateObjectId } from "../utils/generate-string";
import { generateTemplate } from "../utils/mailing/generate-template";
import { StatusCodes } from "../utils/status-codes";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello Managers!");
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
    const uid = generateObjectId().toString();
    const user = await createUser({ uid, email: body.email });
    await setRole(uid, Roles.MANAGER);
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

// Affect an offer to a manager
router.patch(
  "/:managerId/offer/:offerId/affect",
  checkGroup(Groups.ADMINS),
  async (req, res) => {
    try {
      const { params } = req;
      const result = await affectOfferToManager(
        params.offerId,
        params.managerId
      );
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);

// Unaffect an offer from a manager
router.patch(
  "/:managerId/offer/:offerId/unaffect",
  checkGroup(Groups.ADMINS),
  async (req, res) => {
    try {
      const { params } = req;
      const result = await unaffectOfferFromManager(params.managerId);
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);

// Assign a manager to a client
router.patch(
  "/:managerId/client/:clientId/assign",
  checkGroup(Groups.ADMINS),
  async (req, res) => {
    try {
      const { params } = req;
      const result = await assignManagerToClient(
        params.managerId,
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
