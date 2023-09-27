import { Router } from "express";
import { createOffer, deleteOffer, getOffer, getOffers } from "../helpers/offers";
import { Groups, checkGroup } from "../middlewares/check-group";
import { handleError } from "../utils";
import { StatusCodes } from "../utils/status-codes";

const router = Router();

router.get(
  "/",
  checkGroup(Groups.ADMINS_OR_SUPERVISORS),
  async (req, res) => {
    try {
      const result = await getOffers();
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);
router.get(
  "/:id",
  checkGroup(Groups.ADMINS_OR_SUPERVISORS),
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await getOffer(id);
      res.status(StatusCodes.OK).send(result);
    } catch (error) {
      handleError({ res, error });
    }
  }
);
router.post("/", checkGroup(Groups.ADMINS), async (req, res) => {
  try {
    const { body } = req;
    const result = await createOffer(body);
    res.status(StatusCodes.CREATED).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
router.put("/:id", checkGroup(Groups.ADMINS), async (req, res) => {
  try {
    const { body, params } = req;
    const result = await updateClient(params.id, { ...body });
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
router.delete("/:id", checkGroup(Groups.ADMINS), async (req, res) => {
  try {
    const { params } = req;
    const result = await deleteOffer(params.id);
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
export default router;
