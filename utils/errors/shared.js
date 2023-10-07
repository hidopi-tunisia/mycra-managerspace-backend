import { StatusCodes } from "../status-codes.js";
import { BaseError } from "./base-error.js";

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
