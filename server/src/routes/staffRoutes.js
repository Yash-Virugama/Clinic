import { Router } from "express";
import {
  getStaff,
  updateStaffRoleAndPermissions,
  toggleStaffStatus,
  deleteStaff,
} from "../controllers/staffController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = Router();

// Apply protect & adminOnly to all staff management routes
router.use(protect);
router.use(adminOnly);

router.route("/")
  .get(getStaff);

router.route("/:id/role")
  .patch(updateStaffRoleAndPermissions);

router.route("/:id/status")
  .patch(toggleStaffStatus);

router.route("/:id")
  .delete(deleteStaff);

export default router;
