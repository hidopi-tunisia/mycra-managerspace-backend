import { createClient, getClient } from "../helpers/clients";
import { getConsultant } from "../helpers/consultants";
import {
  affectProjectToClient,
  assignConsultantToProject,
  createProject,
  getProject,
  unaffectProjectFromClient,
  unassignConsultantFromProject,
} from "../helpers/projects";
import { Groups, checkGroup } from "../middlewares/check-group";
import { handleError, isValidEmail } from "../utils";
import { ForbiddenError, InvalidEmailError } from "../utils/errors/auth";
import { StatusCodes } from "../utils/status-codes";

const router = Router();

router.get("/", checkGroup(Groups.ADMINS_OR_MANAGERS), (req, res) => {
  res.send("Hello Consultants!");
});
router.get("/:id", checkGroup(Groups.ADMINS_OR_MANAGERS), async (req, res) => {
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
    const result = await getClient(id, {
      ...options,
    });
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
router.post("/", checkGroup(Groups.MANAGERS), async (req, res) => {
  try {
    const { user: manager, body } = req;
    if (!body.email || !isValidEmail(body.email)) {
      throw new InvalidEmailError();
    }
    const result = await createClient({
      ...body,
      manager: manager.uid,
    });
    res.status(StatusCodes.CREATED).send(result);
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

// Create a project for a client
router.post(
  "/:clientId/projects",
  checkGroup(Groups.MANAGERS),
  async (req, res) => {
    try {
      const { user, body, params } = req;
      const client = await getClient(params.clientId);
      if (!client.manager.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const result = await createProject({
        ...body,
        client: client._id,
        manager: user.uid,
      });
      res.status(StatusCodes.CREATED).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);

// Affect a project to a client
router.patch(
  "/:clientId/projects/:projectId/affect",
  checkGroup(Groups.MANAGERS),
  async (req, res) => {
    try {
      const { user, params } = req;
      const client = await getClient(params.clientId);
      if (!client.manager.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const project = await getProject(params.projectId);
      if (!project.manager.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const result = await affectProjectToClient(
        params.projectId,
        params.clientId
      );
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);

// Unffect a project from a client
router.patch(
  "/:clientId/projects/:projectId/unaffect",
  checkGroup(Groups.MANAGERS),
  async (req, res) => {
    try {
      const { user, params } = req;
      const client = await getClient(params.clientId);
      if (!client.manager.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const project = await getProject(params.projectId);
      if (!project.manager.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const result = await unaffectProjectFromClient(
        params.projectId,
        params.clientId
      );
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);

// Assign a consultant to a project
router.patch(
  "/:clientId/projects/:projectId/consultants/:consultantId/assign",
  checkGroup(Groups.MANAGERS),
  async (req, res) => {
    try {
      const { user, params } = req;
      const client = await getClient(params.clientId);
      if (!client.manager.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const project = await getProject(params.projectId);
      if (!project.manager.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const consultant = await getConsultant(params.consultantId);
      if (!consultant.manager.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const result = await assignConsultantToProject(
        params.projectId,
        params.consultantId
      );
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);

// Unassign a consultant from a project
router.patch(
  "/:clientId/projects/:projectId/consultants/:consultantId/unassign",
  checkGroup(Groups.MANAGERS),
  async (req, res) => {
    try {
      const { user, params } = req;
      const client = await getClient(params.clientId);
      if (!client.manager.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const project = await getProject(params.projectId);
      if (!project.manager.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const consultant = await getConsultant(params.consultantId);
      if (!consultant.manager.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const result = await unassignConsultantFromProject(
        params.projectId,
        params.consultantId
      );
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);

export default router;
