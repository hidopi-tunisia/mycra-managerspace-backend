import express from "express";
import { Groups, checkGroup } from "../middlewares/check-group";
import { createClient, getClient } from "../helpers/clients";
import { handleError, isValidEmail } from "../utils";
import { StatusCodes } from "../utils/status-codes";
import { InvalidEmailError } from "../utils/errors/auth";

const router = express.Router();

router.get("/", checkGroup(Groups.ADMINS_OR_MANAGERS), (req, res) => {
  res.send("Hello Consultants!");
});
router.get("/:id", checkGroup(Groups.ADMINS_OR_MANAGERS), async (req, res) => {
  try {
    const { id } = req.params;
    const { join } = req.query;
    const options = {};
    if (typeof join === "string") {
      options["join"] = join;
    }
    const result = await getClient(id, {
      ...options,
    });
    res.status(StatusCodes.OK).send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
router.post("/", checkGroup(Groups.MANAGERS), async (req, res) => {
  try {
    const { user: manager, body } = req;
    if (!body.email || !isValidEmail(body.email)) {
      throw new InvalidEmailError();
    }
    const result = await createClient({
      ...body,
      manager: manager.uid,
    });
    res.status(StatusCodes.CREATED).send(result);
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
