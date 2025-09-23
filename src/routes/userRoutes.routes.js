import { Router } from "express";
import {
  getUsers,
  createUser,
  getUser,
  deleteUser,
  userLogin,
} from "../controllers/userController.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/auth.js";

const router = Router();

router.post("/register", createUser);
router.get("/", authenticateToken,isAdmin, getUsers);
router.get("/:id", authenticateToken, isAdmin, getUser);
router.delete("/:id", authenticateToken, deleteUser);
router.post("/login", userLogin);

export default router;
