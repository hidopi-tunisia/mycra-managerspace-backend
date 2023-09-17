import { StatusCodes } from "../status-codes";
import { BaseError } from "./base-error";

class AlreadyAssignedError extends BaseError {
  #code = StatusCodes.NOT_ACCEPTABLE;
  constructor() {
    super();
    this.message = "Already assigned";
    this.name = "AlreadyAssigned";
    this.code = this.#code;
  }
}

export { AlreadyAssignedError };
