import { Consultant, Project } from "../models";
import { ProjectNotFoundError } from "../utils/errors/projects";

const getProject = async (id) => {
  let doc = await Project.findById(id);
  if (!doc) {
    throw new ProjectNotFoundError();
  }
  return doc;
};

const createProject = (payload) => {
  return new Project({ ...payload }).save();
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
 * Assigns a consultant to a project.
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

export { createProject, getProject, assignConsultantToProject, unassignConsultantFromProject };
