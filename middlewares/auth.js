import admin from "firebase-admin";
import {
  NoAuthorizationHeaderError,
  NoAuthorizationTokenError,
  handleError,
} from "../errors";

const auth = (req, res, next) => {
  const fn = async () => {
    try {
      const { authorization } = req.headers;
      if (authorization) {
        const token = await admin.auth().verifyIdToken(authorization);
        if (token) {
          req.user = token;
          return next();
        }
        throw new NoAuthorizationHeaderError();
      }
      throw new NoAuthorizationTokenError();
    } catch (error) {
      handleError({ res, error });
    }
  };
  fn();
};

export { auth };
