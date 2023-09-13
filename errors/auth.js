import { BaseError } from "./base-error";

class NoAuthorizationHeaderError extends BaseError {
  #code = 401;
  constructor() {
    super();
    this.message = "No authorization header";
    this.name = "NoAuthorizationHeader";
    this.code = this.#code;
  }
}

class NoAuthorizationTokenError extends BaseError {
  #code = 400;
  constructor() {
    super();
    this.message = "No authorization token";
    this.name = "NoAuthorizationToken";
    this.code = this.#code;
  }
}

class ForbiddenError extends BaseError {
  #code = 401;
  constructor() {
    super();
    this.message = "Not allowed";
    this.name = "NotAllowed";
    this.code = this.#code;
  }
}

class UnidentifiedRoleError extends BaseError {
  #code = 400;
  constructor() {
    super();
    this.message = "Unidentified role";
    this.name = "UnidentifiedRole";
    this.code = this.#code;
  }
}

export {
  NoAuthorizationHeaderError,
  NoAuthorizationTokenError,
  ForbiddenError,
  UnidentifiedRoleError,
};
