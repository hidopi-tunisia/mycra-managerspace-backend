import { StatusCodes } from "../status-codes";
import { BaseError } from "./base-error";

class InvalidYearError extends BaseError {
  #code = StatusCodes.NOT_ACCEPTABLE;
  constructor() {
    super();
    this.message = "Invalid year";
    this.name = "InvalidYear";
    this.code = this.#code;
  }
}

class InvalidCountryError extends BaseError {
  #code = StatusCodes.NOT_ACCEPTABLE;
  constructor() {
    super();
    this.message = "Invalid country";
    this.name = "InvalidCountry";
    this.code = this.#code;
  }
}
class InvalidMonthError extends BaseError {
  #code = StatusCodes.NOT_ACCEPTABLE;
  constructor() {
    super();
    this.message = "Invalid month";
    this.name = "InvalidMonth";
    this.code = this.#code;
  }
}

export { InvalidYearError, InvalidMonthError, InvalidCountryError };
