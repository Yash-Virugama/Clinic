import { Router } from "express";
import { exportPatients, exportClinicPatients } from "../controllers/exportController.js";
import { protect, authorizePermissions } from "../middlewares/authMiddleware.js";

const router = Router();

router.get(
  "/patients",
  protect,
  authorizePermissions("reports:view"),
  exportPatients
);

router.get(
  "/clinic-patients",
  protect,
  authorizePermissions("reports:view"),
  exportClinicPatients
);

export default router;