import { Router } from "express";
import { getAll, getOne, update } from "../controllers/lawyerController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", update);

export default router;
