import { Router } from "express";
import { getConsultant } from "../helpers/consultants";
import { getCRA, getCRAs } from "../helpers/cras";
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
      start,
      end,
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
    if (typeof start === "start") {
      options["end"] = end;
    }
    if (typeof populate === "string") {
      options["populate"] = populate;
    }
    if (typeof count === "string") {
      options["count"] = count;
    }
    let result;
    switch (user.role) {
      case Roles.MANAGER:
        options["manager"] = user.uid;
        result = await getCRAs(options);
        break;
      case Roles.CONSULTANT:
        options["consultant"] = user.uid;
        result = await getCRAs(options);
        break;

      default:
        break;
    }
    result = await getCRAs();
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});

export default router;
