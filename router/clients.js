import { Router } from "express";
import {
  assignSupervisorToClient,
  createClient,
  getClient,
  getClients,
} from "../helpers/clients";
import { getConsultant } from "../helpers/consultants";
import {
  assignProjectToClient,
  assignSupervisorToProject,
  assignConsultantToProject,
  createProject,
  getProject,
  unassignProjectFromClient,
  unassignConsultantFromProject,
  setProjectStatus,
} from "../helpers/projects";
import { Groups, Roles, checkGroup } from "../middlewares/check-group";
import { Statuses } from "../models/project";
import { handleError, isValidEmail } from "../utils";
import { ForbiddenError, InvalidEmailError } from "../utils/errors/auth";
import { AlreadyAssignedError } from "../utils/errors/shared";
import { StatusCodes } from "../utils/status-codes";
import { emitter } from "../helpers/events";

const router = Router();

router.get("/", checkGroup(Groups.ADMINS_OR_SUPERVISORS), async (req, res) => {
  try {
    const { user } = req;
    const {
      page,
      limit,
      sort,
      supervisor,
      createdAtMin,
      createdAtMax,
      populate,
    } = req.query;
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
    if (typeof createdAtMin === "string") {
      options["created-at-min"] = createdAtMin;
    }
    if (typeof createdAtMax === "string") {
      options["created-at-min"] = createdAtMax;
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
        result = await getClients(options);
        break;
      case Roles.ADMIN:
        if (typeof supervisor === "string") {
          options["supervisor"] = supervisor;
        }
        result = await getClients(options);
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
  }
);
router.post("/", checkGroup(Groups.SUPERVISORS), async (req, res) => {
  try {
    const { user: supervisor, body } = req;
    if (!body.email || !isValidEmail(body.email)) {
      throw new InvalidEmailError();
    }
    const result = await createClient({
      ...body,
      supervisor: supervisor.uid,
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

// Assign a client to a supervisor
router.patch(
  "/:clientId/supervisors/:supervisorId/assign",
  checkGroup(Groups.SUPERVISORS),
  async (req, res) => {
    try {
      const { user, params } = req;
      const client = await getClient(params.clientId);
      if (!client.supervisor.equals(user.uid)) {
        throw new ForbiddenError();
      }
      if (client.supervisor.equals(params.supervisorId)) {
        throw new AlreadyAssignedError();
      }
      const result = await assignSupervisorToClient(
        params.clientId,
        params.supervisorId
      );
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);

// Create a project for a client
router.post(
  "/:clientId/projects",
  checkGroup(Groups.SUPERVISORS),
  async (req, res) => {
    try {
      const { user, body, params } = req;
      const client = await getClient(params.clientId);
      if (!client.supervisor.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const result = await createProject({
        ...body,
        client: client._id,
        supervisor: user.uid,
      });
      res.status(StatusCodes.CREATED).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);

// Assign a project to a client
router.patch(
  "/:clientId/projects/:projectId/assign",
  checkGroup(Groups.SUPERVISORS),
  async (req, res) => {
    try {
      const { user, params } = req;
      const client = await getClient(params.clientId);
      if (!client.supervisor.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const project = await getProject(params.projectId);
      if (!project.supervisor.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const result = await assignProjectToClient(
        params.projectId,
        params.clientId
      );
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);

// Unassign a project from a client
router.patch(
  "/:clientId/projects/:projectId/unassign",
  checkGroup(Groups.SUPERVISORS),
  async (req, res) => {
    try {
      const { user, params } = req;
      const client = await getClient(params.clientId);
      if (!client.supervisor.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const project = await getProject(params.projectId);
      if (!project.supervisor.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const result = await unassignProjectFromClient(
        params.projectId,
        params.clientId
      );
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);

// Toggles a project status from "active" to "inactive" and vice-versa
router.patch(
  "/:clientId/projects/:projectId/status",
  checkGroup(Groups.SUPERVISORS),
  async (req, res) => {
    try {
      const { user, params } = req;
      const client = await getClient(params.clientId);
      if (!client.supervisor.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const project = await getProject(params.projectId);
      if (!project.supervisor.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const status =
        project.status === Statuses.ACTIVE
          ? Statuses.INACTIVE
          : Statuses.ACTIVE;
      const result = await setProjectStatus(params.projectId, status);
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);

// Assign a consultant to a project
router.patch(
  "/:clientId/projects/:projectId/consultants/:consultantId/assign",
  checkGroup(Groups.SUPERVISORS),
  async (req, res) => {
    try {
      const { user, params } = req;
      const client = await getClient(params.clientId);
      if (!client.supervisor.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const project = await getProject(params.projectId);
      if (!project.supervisor.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const result = await assignConsultantToProject(
        params.projectId,
        params.consultantId
      );
      res.status(StatusCodes.OK).send(result);
      emitter.emit("consultant-assigned-to-project", {
        id: project._id,
        consultantId: params.consultantId,
        clientId: client._id,
        projectName: project.name,
      });
    } catch (error) {
      handleError({ res, error });
    }
  }
);

// Unassign a consultant from a project
router.patch(
  "/:clientId/projects/:projectId/consultants/:consultantId/unassign",
  checkGroup(Groups.SUPERVISORS),
  async (req, res) => {
    try {
      const { user, params } = req;
      const client = await getClient(params.clientId);
      if (!client.supervisor.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const project = await getProject(params.projectId);
      if (!project.supervisor.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const consultant = await getConsultant(params.consultantId);
      if (!consultant.supervisor.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const result = await unassignConsultantFromProject(
        params.projectId,
        params.consultantId
      );
      res.status(StatusCodes.OK).send(result);
      emitter.emit("consultant-unassigned-from-project", {
        id: project._id,
        consultantId: params.consultantId,
        clientId: client._id,
        projectName: project.name,
      });
    } catch (error) {
      handleError({ res, error });
    }
  }
);

// Assign a supervisor to a project
router.patch(
  "/:clientId/projects/:projectId/supervisors/:supervisorId/assign",
  checkGroup(Groups.SUPERVISORS),
  async (req, res) => {
    try {
      const { user, params } = req;
      const client = await getClient(params.clientId);
      if (!client.supervisor.equals(user.uid)) {
        throw new ForbiddenError();
      }
      const project = await getProject(params.projectId);
      if (!project.supervisor.equals(user.uid)) {
        throw new ForbiddenError();
      }
      if (project.supervisor.equals(params.supervisorId)) {
        throw new AlreadyAssignedError();
      }
      const result = await assignSupervisorToProject(
        params.projectId,
        params.supervisorId
      );
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);

export default router;
