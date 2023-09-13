import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello Consultants!");
});
router.get("/:id", (req, res) => {
  res.send("Hello Consultant!");
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
