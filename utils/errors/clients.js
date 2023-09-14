import { BaseError } from "./base-error";

class ClientNotFoundError extends BaseError {
  #code = 404;
  constructor() {
    super();
    this.message = "Client not found";
    this.name = "ClientNotFound";
    this.code = this.#code;
  }
}

export { ClientNotFoundError };
