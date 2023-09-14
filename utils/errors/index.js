import { BaseError } from "./base-error";

export {
  NoAuthorizationHeaderError,
  NoAuthorizationTokenError,
  ForbiddenError,
  UnidentifiedRoleError,
} from "./auth";

export function handleError({ res, error }) {
  console.info("-----ERROR-----");
  console.info(error);
  console.info("-----ERROR-----");
  if (res) {
    if (error instanceof BaseError) {
      res.status(error.code).send({ ...error });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: "Error happened", name: "InternalServerError" });
    }
  }
}
