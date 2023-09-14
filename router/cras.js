import express from "express";
import { getCRA } from "../helpers/cras";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello Cras!");
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { join } = req.query;
    const options = {};
    if (typeof join === "string") {
      options["join"] = join;
    }
    const result = await getCRA(id, {
      ...options,
    });
    res.status(StatusCodes.OK).send(result);
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
