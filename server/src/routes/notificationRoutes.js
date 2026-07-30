import { Router } from "express";
import { protect, authorizePermissions, staffOnly } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { subscriptionSchema, sendNotificationSchema } from "../validations/notificationSchema.js";
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
router.post("/subscribe", protect, validate(subscriptionSchema), subscribe);
router.post("/unsubscribe", protect, unsubscribe);
router.post("/status", protect, getStatus);
router.put("/preferences", protect, updatePreferences);

// Admin notification routes
router.get("/users", protect, staffOnly, getUsersList);
router.post("/send", protect, authorizePermissions("notifications:send"), validate(sendNotificationSchema), sendAdminNotification);

export default router;
