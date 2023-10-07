import { StatusCodes } from "../status-codes.js";

class BaseError extends Error {
  #code = StatusCodes.INTERNAL_SERVER_ERROR;
  constructor() {
    super();
    this.message = "Unable to perform task";
    this.name = "UnableToPerform";
    this.code = this.#code;
  }
}
export { BaseError };
