import { Router } from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "../controllers/deadlineController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
