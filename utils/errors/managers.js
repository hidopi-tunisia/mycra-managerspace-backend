import { BaseError } from "./base-error";

class ManagerNotFoundError extends BaseError {
  #code = 404;
  constructor() {
    super();
    this.message = "Manager not found";
    this.name = "ManagerNotFound";
    this.code = this.#code;
  }
}

export { ManagerNotFoundError };
