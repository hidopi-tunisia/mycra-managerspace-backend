import express from "express";
import { auth } from "../middlewares/auth";

const router = express.Router();
router.use("/", auth);

router.get("/", (req, res) => {
  res.send("Hello Consultants!");
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
