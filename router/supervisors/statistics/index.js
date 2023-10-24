import { Router } from "express";
import clientsRouter from "./clients.js";
import consultantsRouter from "./consultants.js";
import projectsRouter from "./projects.js";
import alertsRouter from "./alerts.js";
import crasRouter from "./cras.js";

const router = Router();
router.use("/clients", clientsRouter);
router.use("/consultants", consultantsRouter);
router.use("/projects", projectsRouter);
router.use("/alerts", alertsRouter);
router.use("/cras", crasRouter);

export default router;
