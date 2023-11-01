import { Router } from "express";
import { getAlertsCount } from "../../../helpers/supervisors/statistics/alerts.js";
import { checkGroup, Groups } from "../../../middlewares/check-group.js";
import { handleError } from "../../../utils/index.js";
import { StatusCodes } from "../../../utils/status-codes.js";

const router = Router();

router.get("/count", checkGroup(Groups.SUPERVISORS), async (req, res) => {
  try {
    const { user } = req;
    const {
      "created-at-min": camin,
      "created-at-max": camax,
      "is-read": is_read,
    } = req.query;
    console.log(req.query);
    const options = {};
    if (typeof camin === "string") {
      options["createdAtMin"] = camin;
    }
    if (typeof camax === "string") {
      options["createdAtMax"] = camax;
    }
    if (is_read === "true") {
      options["isRead"] = true;
    } else if (is_read === "false") {
      options["isRead"] = false;
    }
    options["supervisor"] = user.uid;
    const result = await getAlertsCount(options);
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
export default router;
