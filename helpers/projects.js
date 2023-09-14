import { Project } from "../models";
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

export { createProject, getProject };

