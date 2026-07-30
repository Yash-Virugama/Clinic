import { Router } from "express";
import { exportPatients } from "../controllers/exportController.js";
import { protect, authorizePermissions } from "../middlewares/authMiddleware.js";

const router = Router();

router.get(
  "/patients",
  protect,
  authorizePermissions("reports:view"),
  exportPatients
);

export default router;