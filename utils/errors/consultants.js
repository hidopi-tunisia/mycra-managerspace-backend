import { StatusCodes } from "../status-codes";
import { BaseError } from "./base-error";

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
