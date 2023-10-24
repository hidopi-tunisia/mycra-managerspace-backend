import { Router } from "express";
import { getAlertsCount } from "../../../helpers/supervisors/statistics/alerts.js";
import { checkGroup, Groups } from "../../../middlewares/check-group.js";
import { handleError } from "../../../utils/index.js";
import { StatusCodes } from "../../../utils/status-codes.js";

const router = Router();

router.get("/count", checkGroup(Groups.SUPERVISORS), async (req, res) => {
  try {
    const { user } = req;
    const { sex, "created-at-min": camin, "created-at-max": camax } = req.query;
    const options = {};
    if (typeof sex === "string") {
      options["sex"] = sex;
    }
    if (typeof camin === "string") {
      options["createdAtMin"] = camin;
    }
    if (typeof camax === "string") {
      options["createdAtMax"] = camax;
    }
    options["supervisor"] = user.uid;
    const result = await getAlertsCount(options);
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
export default router;
