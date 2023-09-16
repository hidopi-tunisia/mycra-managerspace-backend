import { Client, Consultant, Project } from "../models";
import { ProjectNotFoundError } from "../utils/errors/projects";

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
  const doc = await new Project({ ...payload }).save();
  await Client.findOneAndUpdate(
    { _id: payload.client },
    { $addToSet: { projects: doc._id } }
  );
  return doc;
};

/**
 * Affect a project to a client.
 * @function
 * @param {string} projectId - The id of the project.
 * @param {string} clientId - The id of the client.
 * @returns {Promise<Project>}
 */
const affectProjectToClient = async (projectId, clientId) => {
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
 * Unaffect a project form a client.
 * @function
 * @param {string} projectId - The id of the project.
 * @param {string} clientId - The id of the client.
 * @returns {Promise<Project>}
 */
const unaffectProjectFromClient = async (projectId, clientId) => {
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

export {
  createProject,
  getProject,
  affectProjectToClient,
  unaffectProjectFromClient,
  assignConsultantToProject,
  unassignConsultantFromProject,
};
