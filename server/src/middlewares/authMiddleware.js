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
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    throw new ApiError(401, "User no longer exists.");
  }

  if (user.isActive === false) {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    throw new ApiError(403, "Your account has been deactivated. Please contact administration.");
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

// Staff Only Middleware
export const staffOnly = (req, res, next) => {
  const staffRoles = ["admin", "assistant", "intern", "physiotherapist", "receptionist"];
  if (!staffRoles.includes(req.user.role)) {
    throw new ApiError(403, "Access denied. Staff only.");
  }

  next();
};

// Authorize Permissions Middleware
export const authorizePermissions = (...requiredPermissions) => {
  return (req, res, next) => {
    if (req.user.role === "admin") {
      return next();
    }

    const hasPermission = requiredPermissions.every((perm) =>
      req.user.permissions && req.user.permissions.includes(perm)
    );

    if (!hasPermission) {
      throw new ApiError(403, "You do not have the required permissions to access this resource.");
    }

    next();
  };
};

// Optional Protect Routes
export const optionalProtect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Ignore token verification errors for public routes
    }
  }

  next();
});