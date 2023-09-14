import express from "express";
import { Groups, checkGroup } from "../middlewares/check-group";
import { getManager } from "../helpers/managers";
import { handleError } from "../utils";
import { StatusCodes } from "../utils/status-codes";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello Managers!");
});
router.get("/:id", checkGroup(Groups.ADMINS), async (req, res) => {
  try {
    const { id } = req.params;
    const { join } = req.query;
    const options = {};
    if (typeof join === "string") {
      options["join"] = join;
    }
    const result = await getManager(id, {
      ...options,
    });
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
router.put("/:id", (req, res) => {
  res.send("Got a PUT request at :id");
});
router.delete("/:id", (req, res) => {
  res.send("Got a DELETE request at /user");
});

export default router;
