import { StatusCodes } from "../status-codes";
import { BaseError } from "./base-error";

class ClientNotFoundError extends BaseError {
  #code = StatusCodes.NOT_FOUND;
  constructor() {
    super();
    this.message = "Client not found";
    this.name = "ClientNotFound";
    this.code = this.#code;
  }
}

export { ClientNotFoundError };
