import { StatusCodes } from "../status-codes";
import { BaseError } from "./base-error";

class ProjectNotFoundError extends BaseError {
  #code = StatusCodes.NOT_FOUND;
  constructor() {
    super();
    this.message = "Project not found";
    this.name = "ProjectNotFound";
    this.code = this.#code;
  }
}

export { ProjectNotFoundError };
