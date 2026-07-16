import { Router } from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, forgotPassword, resetPassword, updateProfile, changePassword } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  profileSchema,
  changePasswordSchema,
} from "../validations/authSchema.js";

const router = Router();

// Public Routes
router.route("/register").post(authLimiter, validate(registerSchema), registerUser);
router.route("/login").post(authLimiter, validate(loginSchema), loginUser);
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.put("/reset-password/:token", authLimiter, validate(resetPasswordSchema), resetPassword);

// Protected Routes
router.route("/me").get(protect, getCurrentUser);
router.put("/profile", protect, upload.single("image"), validate(profileSchema), updateProfile);
router.route("/logout").post(protect, logoutUser);
router.put("/change-password", protect, validate(changePasswordSchema), changePassword);



export default router;