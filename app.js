import express from "express";
import "dotenv/config";
import "./config/firebase";
import "./config/database";

import { auth } from "./middlewares/auth";

import { crasRoutes } from "./routes";
import { consultantsRoutes } from "./routes";
import { clientsRoutes } from "./routes";
import { managersRoutes } from "./routes";

const app = express();
const router = express.Router();
const APP_PORT = process.env.APP_PORT;

app.use(express.static("./views"));

router.use("/", auth);

router.use("/cras", crasRoutes);
router.use("/managers", managersRoutes);
router.use("/clients", clientsRoutes);
router.use("/consultants", consultantsRoutes);

app.use("/", router);

app.listen(APP_PORT, () => {
  console.log(`Server listening on port ${APP_PORT}`);
});
