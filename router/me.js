import { Router } from "express";
import { getConsultant } from "../helpers/consultants";
import { getCRA, getCRAs } from "../helpers/cras";
import { getSupervisor } from "../helpers/supervisors";
import { Groups, Roles, checkGroup } from "../middlewares/check-group";
import { handleError } from "../utils";
import { StatusCodes } from "../utils/status-codes";

const router = Router();

router.get(
  "/",
  checkGroup(Groups.SUPERVISORS_OR_CONSULTANTS),
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
        case Roles.SUPERVISOR:
          result = await getSupervisor(user.uid, options);
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

// http://localhost:30000/me/cras?page=1&limit=2&sort=DESC&year=2023&month=5&start=2020-02-22&end=2020-10-23
router.get("/cras", async (req, res) => {
  try {
    const { user } = req;
    const {
      page,
      limit,
      sort,
      project,
      consultant,
      client,
      year,
      month,
      createdAtMin,
      createdAtMax,
      submittedAtMin,
      submittedAtMax,
      populate,
      count,
    } = req.query;
    const options = {};
    if (!isNaN(page) && page >= 0) {
      options["page"] = page;
    }
    if (!isNaN(limit) && limit > 0) {
      options["limit"] = limit;
    }
    if (sort === "ASC" || sort === "DESC") {
      options["sort"] = sort;
    }
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
    if (typeof createdAtMin === "string") {
      options["created-at-min"] = createdAtMin;
    }
    if (typeof createdAtMax === "string") {
      options["created-at-min"] = createdAtMax;
    }
    if (typeof submittedAtMin === "string") {
      options["submitted-at-min"] =submittedAtMin;
    }
    if (typeof submittedAtMax === "string") {
      options["submitted-at-max"] = submittedAtMax;
    }
    if (typeof populate === "string") {
      options["populate"] = populate;
    }
    if (typeof count === "string") {
      options["count"] = count;
    }
    let result;
    switch (user.role) {
      case Roles.SUPERVISOR:
        options["supervisor"] = user.uid;
        result = await getCRAs(options);
        break;
      case Roles.CONSULTANT:
        options["consultant"] = user.uid;
        result = await getCRAs(options);
        break;

      default:
        break;
    }
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});

export default router;
