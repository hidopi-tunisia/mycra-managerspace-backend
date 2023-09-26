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
  supervisorsRouter,
  offersRouter,
  meRouter,
  miscsRouter,
} from "./router";
import "./events";
const app = express();
const router = Router();
const APP_PORT = process.env.APP_PORT;

app.use(express.json());
app.use(express.static("./views"));

router.use("/", auth);

router.use("/auth", authRouter);
router.use("/cras", crasRouter);
router.use("/supervisors", supervisorsRouter);
router.use("/clients", clientsRouter);
router.use("/consultants", consultantsRouter);
router.use("/offers", offersRouter);
router.use("/me", meRouter);
router.use("/miscs", miscsRouter);

app.use("/", router);

app.listen(APP_PORT, () => {
  console.log(`Server listening on port ${APP_PORT}`);
});
