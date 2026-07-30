import { Router } from "express";
import {
  inviteStaff,
  validateInvitation,
  acceptInvitation,
  getInvitations,
  revokeInvitation,
  resendInvitation,
} from "../controllers/staffInvitationController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes for validation and acceptance
router.get("/:token", validateInvitation);
router.post("/:token/accept", acceptInvitation);

// Admin-only invitation management
router.use(protect);
router.use(adminOnly);

router.route("/")
  .post(inviteStaff)
  .get(getInvitations);

router.route("/:id")
  .delete(revokeInvitation);

router.post("/:id/resend", resendInvitation);

export default router;
