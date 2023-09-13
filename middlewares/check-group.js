import admin from "firebase-admin";
import { ForbiddenError, UnidentifiedRoleError, handleError } from "../utils";

export const Roles = {
  CONSULTANT: "consultant",
  MANAGER: "manager",
  CLIENT: "client",
  ADMIN: "admin",
};

export const Groups = {
  ADMINS: [Roles.ADMIN],
  MANAGERS: [Roles.MANAGER],
  CLIENTS: [Roles.CLIENT],
  CONSULTANTS: [Roles.CONSULTANT],
  ADMINS_OR_MANAGERS: [Roles.ADMIN, Roles.MANAGER],
  ADMINS_OR_CLIENTS: [Roles.ADMIN, Roles.CLIENT],
  ADMINS_OR_CONSULTANTS: [Roles.ADMIN, Roles.CONSULTANT],
};

const checkGroup =
  (groups = Groups.CONSULTANT) =>
  (req, res, next) => {
    const fn = async () => {
      try {
        const user = await admin.auth().getUser(req.user.uid);
        const { role } = user.customClaims;
        if (!role) {
          throw new UnidentifiedRoleError();
        }
        if (groups.includes(role)) {
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
