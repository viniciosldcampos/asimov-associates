import { Router } from "express";
import {
  getAll,
  getOne,
  update,
  reset,
} from "../controllers/permissionController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getAll);
router.get("/:userId", getOne);
router.put("/:userId", update);
router.delete("/:userId/reset", reset);

export default router;
