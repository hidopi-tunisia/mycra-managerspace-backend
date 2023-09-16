import { Router } from "express";
import { getClient } from "../helpers/clients";
import { getConsultant } from "../helpers/consultants";
import { getManager } from "../helpers/managers";
import { Groups, Roles, checkGroup } from "../middlewares/check-group";
import { handleError } from "../utils";
import { StatusCodes } from "../utils/status-codes";

const router = Router();

router.get(
  "/",
  checkGroup(Groups.MANAGERS_OR_CONSULTANTS),
  async (req, res) => {
    try {
      const { user } = req;
      const { populate, count } = req.query;
      const options = {};
      if (typeof populate === "string") {
        options["populate"] = populate;
      }
      if (typeof count === "string") {
        options["count"] = count;
      }
      let result;
      switch (user.role) {
        case Roles.MANAGER:
          result = await getManager(user.uid, options);
          break;
        case Roles.CONSULTANT:
          result = await getConsultant(user.uid, options);
          break;
          
        default:
          break;
      }
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);

export default router;
