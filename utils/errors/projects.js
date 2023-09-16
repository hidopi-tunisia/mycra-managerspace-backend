import { StatusCodes } from "../status-codes";
import { BaseError } from "./base-error";

class OfferNotFoundError extends BaseError {
  #code = StatusCodes.NOT_FOUND;
  constructor() {
    super();
    this.message = "Offer not found";
    this.name = "OfferNotFound";
    this.code = this.#code;
  }
}

export { OfferNotFoundError };
