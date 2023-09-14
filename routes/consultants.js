import express from "express";
import { Groups, checkGroup } from "../middlewares/check-group";
import { getConsultant } from "../helpers/consultants";
import { handleError } from "../utils";

const router = express.Router();

router.get("/", checkGroup(Groups.ADMINS_OR_MANAGERS), (req, res) => {
  res.send("Hello Consultants!");
});
router.get("/:id", checkGroup(Groups.ADMINS_OR_MANAGERS), async (req, res) => {
  try {
    const { id } = req.params;
    const { join } = req.query;
    const result = await getConsultant(id, {
      join,
    });
    res.send(result);
  } catch (error) {
    handleError({ res, error });
  }
});
router.post("/", (req, res) => {
  res.send("Got a POST request");
});
router.put("/:id", (req, res) => {
  res.send("Got a PUT request at :id");
});
router.delete("/:id", (req, res) => {
  res.send("Got a DELETE request at /user");
});

export default router;
