import { Router } from "express";
import { getProjects } from "../helpers/projects.js";
import { Groups, checkGroup, Roles } from "../middlewares/check-group.js";
import { handleError } from "../utils/index.js";
import { StatusCodes } from "../utils/status-codes.js";

const router = Router();

router.get("/", checkGroup(Groups.ADMINS_OR_SUPERVISORS), async (req, res) => {
  try {
    const { user, page, limit, sort, supervisor, client, status } = req;
    const options = {};
    if (!isNaN(page) && page >= 0) {
      options["page"] = page;
    }
    if (!isNaN(limit) && limit > 0) {
      options["limit"] = limit;
    }
    if (sort === "asc" || sort === "desc") {
      options["sort"] = sort;
    }
    if (typeof status === "string") {
      options["status"] = status;
    }
    let result;
    switch (user.role) {
      case Roles.SUPERVISOR:
        if (typeof supervisor === "string") {
          throw new ForbiddenError();
        }
        options["supervisor"] = user.uid;
        if (typeof client === "string") {
          options["client"] = client;
        }
        result = await getProjects(options);
        break;
      case Roles.ADMIN:
        if (typeof supervisor === "string") {
          options["supervisor"] = supervisor;
        }
        if (typeof client === "string") {
          options["client"] = client;
        }
        result = await getProjects(options);
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
