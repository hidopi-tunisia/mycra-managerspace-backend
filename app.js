import "dotenv/config";
import express, { Router } from "express";
import "./config/database";
import "./config/firebase";

import { auth } from "./middlewares/auth";

import {
  authRouter,
  clientsRouter,
  consultantsRouter,
  crasRouter,
  managersRouter,
  offersRouter,
} from "./router";

const app = express();
const router = Router();
const APP_PORT = process.env.APP_PORT;

app.use(express.json());
app.use(express.static("./views"));

router.use("/", auth);

router.use("/auth", authRouter);
router.use("/cras", crasRouter);
router.use("/managers", managersRouter);
router.use("/clients", clientsRouter);
router.use("/consultants", consultantsRouter);
router.use("/offers", offersRouter);

app.use("/", router);

app.listen(APP_PORT, () => {
  console.log(`Server listening on port ${APP_PORT}`);
});
