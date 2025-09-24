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

/**
 * @swagger
 * /habits:
 *   post:
 *     summary: Create new habit
 *     tags:
 *       - Habits
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Habit created successfully
 *       500:
 *         description: Server error
 */
router.post("/", authenticateToken, createHabit);

/**
 * @swagger
 * /habits:
 *   get:
 *     summary: Get all habits for the authenticated user
 *     tags:
 *       - Habits
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of habits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   streak:
 *                     type: integer
 *                   startDate:
 *                     type: string
 *                     format: date
 *                   endDate:
 *                     type: string
 *                     format: date
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", authenticateToken, getHabits);

/**
 * @swagger
 * /habits/{id}:
 *   put:
 *     summary: Update a habit by ID
 *     tags:
 *       - Habits
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The habit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Habit updated successfully
 *       404:
 *         description: Habit not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authenticateToken, updateHabit);

/**
 * @swagger
 * /habits/{id}:
 *   delete:
 *     summary: Delete a habit by ID
 *     tags:
 *       - Habits
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The habit ID
 *     responses:
 *       200:
 *         description: Habit deleted successfully
 *       404:
 *         description: Habit not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authenticateToken, deleteHabit);

/**
 * @swagger
 * /habits/{id}/toggle:
 *   put:
 *     summary: Toggle habit completion for today
 *     tags:
 *       - Habits
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The habit ID
 *     responses:
 *       200:
 *         description: Habit completion toggled
 *       404:
 *         description: Habit not found
 *       500:
 *         description: Server error
 */

router.put("/:id/toggle", authenticateToken, toggleHabitCompletion);

export default router;
