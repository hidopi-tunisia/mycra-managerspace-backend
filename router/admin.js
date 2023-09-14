import express from "express";
import { Groups, Roles, checkGroup } from "../middlewares/check-group";
import { createAdmin, setRole } from "../helpers/admins";
import { handleError, isValidEmail } from "../utils";
import { InvalidEmailError, InvalidRoleError } from "../utils/errors/auth";

const router = express.Router();

router.post("/", checkGroup(Groups.ADMINS), async (req, res) => {
  try {
    const { body } = req;
    if (!body.email || !isValidEmail(body.email)) {
      throw new InvalidEmailError();
    }
    const user = await createAdmin(body);
    const result = await setRole(user.uid, Roles.ADMIN);
    res.status(StatusCodes.CREATED).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});

router.patch("/:id/role", checkGroup(Groups.ADMINS), async (req, res) => {
  try {
    const {
      body: { role },
      params: { id },
    } = req;
    if (!role || !Object.values(Roles).includes(role)) {
      throw new InvalidRoleError();
    }
    const result = await setRole(id, role);
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});

export default router;
