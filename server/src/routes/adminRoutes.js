import express from "express";

import { protect, staffOnly } from "../middlewares/authMiddleware.js";
import { getDashboardStats } from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", protect, staffOnly, getDashboardStats);

export default router;