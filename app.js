import express from "express";
import "dotenv/config";

import { crasRoutes } from "./routes";
import { consultantsRoutes } from "./routes";
import { managersRoutes } from "./routes";

const app = express();
const router = express.Router();
const port = process.env.PORT;

router.get("/", (req, res) => {
  res.send("Server is working...");
});

router.use("/cras", crasRoutes);
router.use("/managers", managersRoutes);
router.use("/consultants", consultantsRoutes);

app.use("/", router);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
