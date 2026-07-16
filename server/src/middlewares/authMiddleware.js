import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

// Protect Routes
export const protect = asyncHandler(async (req, res, next) => {
  // Get token from cookies
  const token = req.cookies.token;

  if (!token) {
    throw new ApiError(401, "Not authorized. Please login.");
  }

  // Verify JWT
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Find user
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    throw new ApiError(401, "User no longer exists.");
  }

  // Attach user to request
  req.user = user;

  next();
});

// Admin Only Middleware
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Access denied. Admin only.");
  }

  next();
};