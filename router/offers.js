import { Router } from "express";
import { createOffer } from "../helpers/offers";
import { Groups, checkGroup } from "../middlewares/check-group";
import { handleError } from "../utils";
import { StatusCodes } from "../utils/status-codes";

const router = Router();

router.post("/", checkGroup(Groups.ADMINS), async (req, res) => {
  try {
    const { body } = req;
    const result = await createOffer(body);
    res.status(StatusCodes.CREATED).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});

export default router;
