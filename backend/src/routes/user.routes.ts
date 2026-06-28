import { Router } from "express";
import { getUsers, changeRole } from "../controllers/user.controller";
import { protect } from "../middleware/auth";

const router = Router();

router.get("/", protect, getUsers);
router.patch("/role", protect, changeRole);

export default router;