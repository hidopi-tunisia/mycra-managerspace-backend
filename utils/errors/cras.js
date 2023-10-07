import { StatusCodes } from "../status-codes.js";
import { BaseError } from "./base-error.js";

class CRANotFoundError extends BaseError {
  #code = StatusCodes.NOT_FOUND;
  constructor() {
    super();
    this.message = "CRA not found";
    this.name = "CRANotFound";
    this.code = this.#code;
  }
}

class CRANotPendingError extends BaseError {
  #code = StatusCodes.NOT_FOUND;
  constructor() {
    super();
    this.message = "CRA not pending";
    this.name = "CRANotPending";
    this.code = this.#code;
  }
}
class CRANotRejectedError extends BaseError {
  #code = StatusCodes.NOT_FOUND;
  constructor() {
    super();
    this.message = "CRA not rejected";
    this.name = "CRANotRejected";
    this.code = this.#code;
  }
}

export { CRANotFoundError, CRANotPendingError, CRANotRejectedError };
