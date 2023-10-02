import { Router } from "express";
import { getConsultant } from "../helpers/consultants";
import {
  approveCRA,
  getCRA,
  markCRAAsDeleted,
  rejectCRA,
} from "../helpers/cras";
import { emitter } from "../helpers/events";
import { Groups, Roles, checkGroup } from "../middlewares/check-group";
import { CRAStatuses } from "../models/cra";
import { ForbiddenError, handleError } from "../utils";
import { CRANotPendingError } from "../utils/errors/cras";
import { StatusCodes } from "../utils/status-codes";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello Cras!");
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { populate, count, total } = req.query;
    const options = {};
    if (typeof populate === "string") {
      options["populate"] = populate;
    }
    if (typeof count === "string") {
      options["count"] = count;
    }
    if (typeof count === "string") {
      options["count"] = count;
    }
    if (total === "true") {
      options["total"] = total;
    }
    const result = await getCRA(id, {
      ...options,
    });
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
router.patch(
  "/:id/approve",
  checkGroup(Groups.SUPERVISORS),
  async (req, res) => {
    try {
      const { user, body, params } = req;
      const cra = await getCRA(params.id);
      const consultantId = cra.consultant;
      const consultant = await getConsultant(consultantId);
      if (!consultant.supervisor.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const meta = {
        at: new Date(),
        by: {
          _id: user.uid,
          role: Roles.SUPERVISOR,
        },
      };
      if (body && body.motive) {
        meta.by.motive = body.motive;
      }
      const action = {
        action: CRAStatuses.APPROVED,
        meta,
      };
      const result = await approveCRA(params.id, action);
      res.status(StatusCodes.OK).send(result);
      emitter.emit("cra-approved", {
        id: cra._id.toString(),
        consultantId: consultantId.toString(),
        motive: body.motive,
      });
    } catch (error) {
      handleError({ res, error });
    }
  }
);
router.patch(
  "/:id/reject",
  checkGroup(Groups.SUPERVISORS),
  async (req, res) => {
    try {
      const { user, body, params } = req;
      const cra = await getCRA(params.id);
      const consultantId = cra.consultant;
      const consultant = await getConsultant(consultantId);
      if (!consultant.supervisor.equals(user.uid)) {
        throw new ForbiddenError();
      }
      if (cra.status !== CRAStatuses.PENDING) {
        throw new CRANotPendingError();
      }
      const meta = {
        at: new Date(),
        by: {
          _id: user.uid,
          role: Roles.SUPERVISOR,
        },
      };
      if (body && body.motive) {
        meta.by.motive = body.motive;
      }
      const action = {
        action: CRAStatuses.REJECTED,
        meta,
      };
      const result = await rejectCRA(params.id, action);
      res.status(StatusCodes.OK).send(result);
      emitter.emit("cra-rejected", {
        id: cra._id.toString(),
        consultantId: consultantId.toString(),
        motive: body.motive,
      });
    } catch (error) {
      handleError({ res, error });
    }
  }
);
router.patch(
  "/:id/delete",
  checkGroup(Groups.ADMINS_OR_SUPERVISORS),
  async (req, res) => {
    try {
      const { params } = req;
      const result = await markCRAAsDeleted(params.id);
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);
router.delete("/:id", checkGroup(Groups.ADMINS), async (req, res) => {
  try {
    const { params } = req;
    const result = await deleteCRA(params.id);
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});

export default router;
