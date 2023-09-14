import { BaseError } from "./base-error";

class CRANotFoundError extends BaseError {
  #code = 404;
  constructor() {
    super();
    this.message = "CRA not found";
    this.name = "CRANotFound";
    this.code = this.#code;
  }
}

export { CRANotFoundError };
