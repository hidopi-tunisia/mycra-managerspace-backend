import { Router } from "express";
import { getCRAsCount } from "../../../helpers/supervisors/statistics/cras.js";
import { handleError } from "../../../utils/index.js";
import { StatusCodes } from "../../../utils/status-codes.js";

const router = Router();

router.get("/count", async (req, res) => {
  try {
    const { user } = req;
    const {
      consultant,
      project,
      client,
      year,
      month,
      "created-at-min": camin,
      "created-at-max": camax,
    } = req.query;
    const options = {};
    if (typeof project === "string") {
      options["project"] = project;
    }
    if (typeof consultant === "consultant") {
      options["consultant"] = consultant;
    }
    if (typeof client === "client") {
      options["client"] = client;
    }
    if (!isNaN(year) && Number(year) >= 2000) {
      options["year"] = Number(year);
    }
    if (!isNaN(month) && Number(month) >= 0 && Number(month) <= 11) {
      options["month"] = Number(month);
    }
    if (typeof camin === "string") {
      options["createdAtMin"] = camin;
    }
    if (typeof camax === "string") {
      options["createdAtMax"] = camax;
    }
    options["supervisor"] = user.uid;
    const result = await getCRAsCount(options);
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
export default router;
