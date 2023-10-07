import { Client, Consultant, Project } from "../models/index.js";
import { ProjectNotFoundError } from "../utils/errors/projects.js";

const getProject = async (id, options = {}) => {
  let doc = await Project.findById(id);
  let meta = {};
  if (!doc) {
    throw new ProjectNotFoundError();
  }
  if (options.populate) {
    doc = await populateData(doc, options.populate);
  }
  if (options.count) {
    const count = countData(doc, options.count);
    if (Object.keys(count).length > 0) {
      meta["count"] = count;
    }
  }
  if (Object.keys(meta).length > 0) {
    doc = doc.toObject();
    doc["meta"] = meta;
  }
  return doc;
};

const createProject = async (payload) => {
  return Project({ ...payload }).save();
};

/**
 * Assign a project to a client.
 * @function
 * @param {string} projectId - The id of the project.
 * @param {string} clientId - The id of the client.
 * @returns {Promise<Project>}
 */
const assignProjectToClient = async (projectId, clientId) => {
  const doc = await Project.findOneAndUpdate(
    { _id: projectId },
    { $set: { client: clientId } },
    {
      new: true,
    }
  );
  await Client.findOneAndUpdate(
    { _id: clientId },
    { $addToSet: { projects: projectId } }
  );
  return doc;
};

/**
 * Unassign a project form a client.
 * @function
 * @param {string} projectId - The id of the project.
 * @param {string} clientId - The id of the client.
 * @returns {Promise<Project>}
 */
const unassignProjectFromClient = async (projectId, clientId) => {
  const doc = await Project.findOneAndUpdate(
    { _id: projectId },
    { $unset: { client: clientId } },
    {
      new: true,
    }
  );
  await Client.findOneAndUpdate(
    { _id: clientId },
    { $pull: { projects: projectId } }
  );
  return doc;
};

/**
 * Assigns a consultant to a project.
 * @function
 * @param {string} projectId - The id of the project.
 * @param {string} consultantId - The id of the consultant.
 * @returns {Promise<Project>}
 */
const assignConsultantToProject = async (projectId, consultantId) => {
  const doc = await Project.findOneAndUpdate(
    { _id: projectId },
    { $addToSet: { consultants: consultantId } },
    {
      new: true,
    }
  );
  await Consultant.findOneAndUpdate(
    { _id: consultantId },
    { $addToSet: { projects: projectId } }
  );
  return doc;
};

/**
 * Unassigns a consultant from a project.
 * @function
 * @param {string} projectId - The id of the project.
 * @param {string} consultantId - The id of the consultant.
 * @returns {Promise<Project>}
 */
const unassignConsultantFromProject = async (projectId, consultantId) => {
  const doc = await Project.findOneAndUpdate(
    { _id: projectId },
    { $pull: { consultants: consultantId } },
    {
      new: true,
    }
  );
  await Consultant.findOneAndUpdate(
    { _id: consultantId },
    { $pull: { projects: projectId } }
  );
  return doc;
};

/**
 * Assign a project to a supervisor.
 * @function
 * @param {string} projectId - The id of the client.
 * @param {string} supervisorId - The id of the project.
 * @returns {Promise<Project>}
 */
const assignSupervisorToProject = async (projectId, supervisorId) => {
  return Project.findOneAndUpdate(
    { _id: projectId },
    { $set: { supervisor: supervisorId } },
    {
      new: true,
    }
  );
};

/**
 * Assign a project to a supervisor.
 * @function
 * @param {string} projectId - The id of the client.
 * @param {('active'|'inactive')} status - The status of the project.
 * @returns {Promise<Project>}
 */
const setProjectStatus = async (projectId, status) => {
  return Project.findOneAndUpdate(
    { _id: projectId },
    { $set: { status } },
    {
      new: true,
    }
  );
};

export {
  createProject,
  getProject,
  assignProjectToClient,
  unassignProjectFromClient,
  assignConsultantToProject,
  unassignConsultantFromProject,
  assignSupervisorToProject,
  setProjectStatus
};
