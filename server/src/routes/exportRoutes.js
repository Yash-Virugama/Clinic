import { Router } from "express";
import { exportPatients } from "../controllers/exportController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = Router();

router.get(
  "/patients",
  protect,
  adminOnly,
  exportPatients
);

export default router;