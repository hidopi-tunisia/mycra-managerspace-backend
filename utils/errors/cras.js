import { StatusCodes } from "../status-codes";
import { BaseError } from "./base-error";

class CRANotFoundError extends BaseError {
  #code = StatusCodes.NOT_FOUND;
  constructor() {
    super();
    this.message = "CRA not found";
    this.name = "CRANotFound";
    this.code = this.#code;
  }
}

export { CRANotFoundError };
