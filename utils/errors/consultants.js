import { StatusCodes } from "../status-codes.js";
import { BaseError } from "./base-error.js";

class ConsultantNotFoundError extends BaseError {
  #code = StatusCodes.NOT_FOUND;
  constructor() {
    super();
    this.message = "Consultant not found";
    this.name = "ConsultantNotFound";
    this.code = this.#code;
  }
}

export { ConsultantNotFoundError };
