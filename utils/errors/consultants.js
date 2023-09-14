import { BaseError } from "./base-error";

class ConsultantNotFoundError extends BaseError {
  #code = 404;
  constructor() {
    super();
    this.message = "Consultant not found";
    this.name = "ConsultantNotFound";
    this.code = this.#code;
  }
}

export {ConsultantNotFoundError}