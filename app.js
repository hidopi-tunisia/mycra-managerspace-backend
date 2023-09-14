import express from "express";
import "dotenv/config";
import "./config/firebase";
import "./config/database";
import admin from 'firebase-admin'
import { auth } from "./middlewares/auth";

import {
  adminsRouter,
  consultantsRouter,
  managersRouter,
  crasRouter,
  clientsRouter,
} from "./router";

const app = express();
const router = express.Router();
const APP_PORT = process.env.APP_PORT;

app.use(express.json());
app.use(express.static("./views"));

router.use("/", auth);

router.use("/admins", adminsRouter);
router.use("/cras", crasRouter);
router.use("/managers", managersRouter);
router.use("/clients", clientsRouter);
router.use("/consultants", consultantsRouter);

app.use("/", router);

app.listen(APP_PORT, () => {
  console.log(`Server listening on port ${APP_PORT}`);
});
