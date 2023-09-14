import { StatusCodes } from "../status-codes";
import { BaseError } from "./base-error";

class NoAuthorizationHeaderError extends BaseError {
  #code = StatusCodes.UNAUTHORIZED;
  constructor() {
    super();
    this.message = "No authorization header";
    this.name = "NoAuthorizationHeader";
    this.code = this.#code;
  }
}

class NoAuthorizationTokenError extends BaseError {
  #code = StatusCodes.BAD_REQUEST;
  constructor() {
    super();
    this.message = "No authorization token";
    this.name = "NoAuthorizationToken";
    this.code = this.#code;
  }
}

class ForbiddenError extends BaseError {
  #code = StatusCodes.FORBIDDEN;
  constructor() {
    super();
    this.message = "Not allowed";
    this.name = "NotAllowed";
    this.code = this.#code;
  }
}

class UnidentifiedRoleError extends BaseError {
  #code = StatusCodes.BAD_REQUEST;
  constructor() {
    super();
    this.message = "Unidentified role";
    this.name = "UnidentifiedRole";
    this.code = this.#code;
  }
}

class InvalidEmailError extends BaseError {
  #code = StatusCodes.PRECONDITION_FAILED;
  constructor() {
    super();
    this.message = "Invalid email";
    this.name = "InvalidEmail";
    this.code = this.#code;
  }
}

class InvalidRoleError extends BaseError {
  #code = StatusCodes.PRECONDITION_FAILED;
  constructor() {
    super();
    this.message = "Invalid role";
    this.name = "InvalidRoleError";
    this.code = this.#code;
  }
}

export {
  NoAuthorizationHeaderError,
  NoAuthorizationTokenError,
  ForbiddenError,
  UnidentifiedRoleError,
  InvalidEmailError,
  InvalidRoleError
};
