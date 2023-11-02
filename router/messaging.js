import { Router } from "express";
import { send } from "../helpers/messaging.js";
import { Groups, checkGroup } from "../middlewares/check-group.js";
import { handleError } from "../utils/index.js";
import { StatusCodes } from "../utils/status-codes.js";

const router = Router();

router.post("/", checkGroup(Groups.ADMINS_OR_SUPERVISORS), async (req, res) => {
  try {
    const { body } = req;
    const result = await send(body);
    res.status(StatusCodes.CREATED).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
export default router;
