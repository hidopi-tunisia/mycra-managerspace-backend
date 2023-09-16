import { Router } from "express";
import { approveCRA, createCRA, getCRA, rejectCRA } from "../helpers/cras";
import { StatusCodes } from "../utils/status-codes";
import { Groups, Roles, checkGroup } from "../middlewares/check-group";
import { handleError } from "../utils";
import { getConsultant } from "../helpers/consultants";
import { CRAStatuses } from "../models/cra";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello Cras!");
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { populate, count } = req.query;
    const options = {};
    if (typeof populate === "string") {
      options["populate"] = populate;
    }
    if (typeof count === "string") {
      options["count"] = count;
    }
    const result = await getCRA(id, {
      ...options,
    });
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
router.post("/", checkGroup(Groups.CONSULTANTS), async (req, res) => {
  try {
    const { user, body } = req;
    const history = [
      {
        action: "created",
        meta: {
          at: new Date(),
          by: {
            _id: user.uid,
            role: Roles.CONSULTANT,
          },
        },
      },
    ];
    const result = await createCRA({
      ...body,
      consultant: user.uid,
      history,
    });
    res.status(StatusCodes.CREATED).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
router.patch("/:id/approve", checkGroup(Groups.MANAGERS), async (req, res) => {
  try {
    const { user, body, params } = req;
    const cra = await getCRA(params.id);
    const consultantId = cra.consultant;
    const consultant = await getConsultant(consultantId);
    if (!consultant.manager.equals(user.uid)) {
      throw new ForbiddenError();
    }
    const meta = {
      at: new Date(),
      by: {
        _id: user.uid,
        role: Roles.MANAGER,
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
  } catch (error) {
    handleError({ res, error });
  }
});
router.patch("/:id/reject", checkGroup(Groups.MANAGERS), async (req, res) => {
  try {
    const { user, body, params } = req;
    const cra = await getCRA(params.id);
    const consultantId = cra.consultant;
    const consultant = await getConsultant(consultantId);
    if (!consultant.manager.equals(user.uid)) {
      throw new ForbiddenError();
    }
    const meta = {
      at: new Date(),
      by: {
        _id: user.uid,
        role: Roles.MANAGER,
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
