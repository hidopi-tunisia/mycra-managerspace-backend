import { BaseError } from "./base-error";

export {
  NoAuthorizationHeaderError,
  NoAuthorizationTokenError,
  ForbiddenError,
} from "./auth";

const ErrorCodes = {
  INTERNAL_SERVER_ERROR: 500,
};
export function handleError({ res, error }) {
  console.info("-----ERROR-----");
  console.info(error);
  console.info("-----ERROR-----");
  if (res) {
    if (error instanceof BaseError) {
      res.status(error.code).send({ ...error });
    } else {
      res
        .status(ErrorCodes.INTERNAL_SERVER_ERROR)
        .send({ message: "Error happened", name: "InternalServerError" });
    }
  }
}
