import { Router } from "express";
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion,
} from "../controllers/habit.controller.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = Router();

router.post("/", authenticateToken, createHabit);
router.get("/", authenticateToken, getHabits);
router.put("/:id", authenticateToken, updateHabit);
router.delete("/:id", authenticateToken, deleteHabit);
router.put("/:id/toggle", authenticateToken, toggleHabitCompletion);

export default router;
