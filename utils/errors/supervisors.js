import { StatusCodes } from "../status-codes.js";
import { BaseError } from "./base-error.js";

class SupervisorNotFoundError extends BaseError {
  #code = StatusCodes.NOT_FOUND;
  constructor() {
    super();
    this.message = "Supervisor not found";
    this.name = "SupervisorNotFound";
    this.code = this.#code;
  }
}

export { SupervisorNotFoundError };
