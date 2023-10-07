import admin from "firebase-admin";
import { ForbiddenError, UnidentifiedRoleError, handleError } from "../utils/index.js";

export const Roles = {
  CONSULTANT: "consultant",
  SUPERVISOR: "supervisor",
  CLIENT: "client",
  ADMIN: "admin",
};

export const Groups = {
  ADMINS: [Roles.ADMIN],
  SUPERVISORS: [Roles.SUPERVISOR],
  CLIENTS: [Roles.CLIENT],
  CONSULTANTS: [Roles.CONSULTANT],
  ADMINS_OR_SUPERVISORS: [Roles.ADMIN, Roles.SUPERVISOR],
  ADMINS_OR_CLIENTS: [Roles.ADMIN, Roles.CLIENT],
  ADMINS_OR_CONSULTANTS: [Roles.ADMIN, Roles.CONSULTANT],
  SUPERVISORS_OR_CONSULTANTS: [Roles.SUPERVISOR, Roles.CONSULTANT],
};

const checkGroup =
  (groups = Groups.CONSULTANT) =>
  (req, res, next) => {
    const fn = async () => {
      try {
        const user = await admin.auth().getUser(req.user.uid);
        if (!user.customClaims || !user.customClaims.role) {
          throw new UnidentifiedRoleError();
        }
        if (groups.includes(user.customClaims.role)) {
          return next();
        }
        throw new ForbiddenError();
      } catch (error) {
        handleError({ res, error });
      }
    };
    fn();
  };

export { checkGroup };
