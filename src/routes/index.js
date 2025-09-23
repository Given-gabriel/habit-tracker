import { Router } from "express";
import userRoutes from "./userRoutes.routes.js";
import habitRoutes from "./habits.routes.js";

const router = Router();

//routes
router.use("/users", userRoutes);
router.use("/habits", habitRoutes);

export default router;
