import { Router } from "express";
import {
  stats,
  processesByInstance,
  upcomingDeadlines,
  processesByMonth,
} from "../controllers/dashboardController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/stats", stats);
router.get("/processes-by-instance", processesByInstance);
router.get("/upcoming-deadlines", upcomingDeadlines);
router.get("/processes-by-month", processesByMonth);

export default router;
