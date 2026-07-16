import express from "express";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { getDashboardStats } from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getDashboardStats);

export default router;