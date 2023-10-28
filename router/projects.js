import { Router } from "express";
import {
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from "../helpers/projects.js";
import { Groups, checkGroup, Roles } from "../middlewares/check-group.js";
import { ForbiddenError, handleError } from "../utils/index.js";
import { StatusCodes } from "../utils/status-codes.js";

const router = Router();

router.get("/", checkGroup(Groups.ADMINS_OR_SUPERVISORS), async (req, res) => {
  try {
    const { user } = req;
    const { page, limit, sort, supervisor, client, status, populate } =
      req.query;
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
    if (typeof populate === "string") {
      options["populate"] = populate;
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
router.get(
  "/:id",
  checkGroup(Groups.ADMINS_OR_SUPERVISORS),
  async (req, res) => {
    try {
      const { params } = req;
      const { populate } = req.query;
      const options = {};
      if (typeof populate === "string") {
        options["populate"] = populate;
      }
      const result = await getProject(params.id, options);
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);
router.put(
  "/:id",
  checkGroup(Groups.ADMINS_OR_SUPERVISORS),
  async (req, res) => {
    try {
      const { body, params } = req;
      const result = await updateProject(params.id, { ...body });
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);
router.delete(
  "/:id",
  checkGroup(Groups.ADMINS_OR_SUPERVISORS),
  async (req, res) => {
    try {
      const { params } = req;
      const result = await deleteProject(params.id);
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);
export default router;
