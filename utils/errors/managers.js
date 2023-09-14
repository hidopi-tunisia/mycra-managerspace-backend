import { StatusCodes } from "../status-codes";
import { BaseError } from "./base-error";

class ManagerNotFoundError extends BaseError {
  #code = StatusCodes.NOT_FOUND;
  constructor() {
    super();
    this.message = "Manager not found";
    this.name = "ManagerNotFound";
    this.code = this.#code;
  }
}

export { ManagerNotFoundError };
