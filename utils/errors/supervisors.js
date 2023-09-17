import { StatusCodes } from "../status-codes";
import { BaseError } from "./base-error";

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
