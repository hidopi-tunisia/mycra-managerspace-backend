import { Router } from "express";
import { getProjectsCount } from "../../../helpers/supervisors/statistics/projects.js";
import { checkGroup, Groups } from "../../../middlewares/check-group.js";
import { handleError } from "../../../utils/index.js";
import { StatusCodes } from "../../../utils/status-codes.js";

const router = Router();

router.get(
  "/count",
  checkGroup(Groups.SUPERVISORS),
  async (req, res) => {
    try {
      const { user } = req;
      const {
        client,
        category,
        status,
        "created-at-min": camin,
        "created-at-max": camax,
      } = req.query;
      const options = {};
      if (typeof client === "string") {
        options["client"] = client;
      }
      if (typeof category === "string") {
        options["category"] = category;
      }
      if (typeof status === "string") {
        options["status"] = status;
      }
      if (typeof camin === "string") {
        options["createdAtMin"] = camin;
      }
      if (typeof camax === "string") {
        options["createdAtMax"] = camax;
      }
      options["supervisor"] = user.uid;
      const result = await getProjectsCount(options);
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);
export default router;
