import { StatusCodes } from "../status-codes.js";
import { BaseError } from "./base-error.js";

class ProjectNotFoundError extends BaseError {
  #code = StatusCodes.NOT_FOUND;
  constructor() {
    super();
    this.message = "Project not found";
    this.name = "ProjectNotFound";
    this.code = this.#code;
  }
}
class NoProjectsError extends BaseError {
  #code = StatusCodes.NOT_FOUND;
  constructor() {
    super();
    this.message = "No projects";
    this.name = "NoProjects";
    this.code = this.#code;
  }
}
class NoCurrentProjectsError extends BaseError {
  #code = StatusCodes.NOT_FOUND;
  constructor() {
    super();
    this.message = "No current projects";
    this.name = "NoCurrentProjects";
    this.code = this.#code;
  }
}

export { ProjectNotFoundError, NoProjectsError, NoCurrentProjectsError };
