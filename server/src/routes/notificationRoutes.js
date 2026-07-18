import { Router } from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  subscribe,
  unsubscribe,
  getStatus,
  updatePreferences,
  getUsersList,
  sendAdminNotification,
} from "../controllers/notificationController.js";

const router = Router();

// User notification routes
router.post("/subscribe", protect, subscribe);
router.post("/unsubscribe", protect, unsubscribe);
router.post("/status", protect, getStatus);
router.put("/preferences", protect, updatePreferences);

// Admin notification routes
router.get("/users", protect, adminOnly, getUsersList);
router.post("/send", protect, adminOnly, sendAdminNotification);

export default router;
