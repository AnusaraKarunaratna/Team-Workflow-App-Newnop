import { Router } from "express";
import { create, getAll, getOne, update, remove} from "../controllers/task.controller";
import { protect } from "../middleware/auth";

const router = Router();

router.use(protect);

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;