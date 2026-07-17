import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { settingSchema } from "../validations/settingSchema.js";

const router = Router();

router.get("/", getSettings);
router.put(
  "/",
  protect,
  adminOnly,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "heroImage", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
    { name: "pwaIcon", maxCount: 1 },
  ]),
  validate(settingSchema),
  updateSettings
);

export default router;
