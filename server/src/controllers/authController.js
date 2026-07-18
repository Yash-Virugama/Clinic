import bcrypt from "bcryptjs";
import { User } from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
import { sendPushToUser } from "../utils/pushNotification.js";

// Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, age, gender } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Please fill all required fields.");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    age,
    gender,
    role: "patient",
  });

  generateToken(res, user._id);

  res.status(201).json({
    success: true,
    message: "Registration successful.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    },
  });
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new ApiError(401, "Invalid email or password.");
  }

  generateToken(res, user._id);

  res.status(200).json({
    success: true,
    message: "Login successful.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    },
  });
});

// Get Current User
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Logout User
export const logoutUser = asyncHandler(async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

// Forget Password
export const forgotPassword = asyncHandler(async (req, res) => {
 
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token before saving
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Token expires in 15 minutes
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000;

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const html = `
    <h2>Password Reset</h2>
    <p>You requested to reset your password.</p>
    <p>Click the link below to set a new password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 15 minutes.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: "Reset Your Password",
    html,
  });

  res.status(200).json({
    success: true,
    message: "Password reset link sent to your email.",
  });
});

// Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, "Password is required.");
  }

  // Hash the token received from the URL
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // Find user with matching token that hasn't expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token.");
  }

  // Update password
  user.password = await bcrypt.hash(password, 10);;

  // Clear reset fields
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const payload = {
    title: "Password Changed",
    body: "Your account password was updated successfully via reset link. If this wasn't you, please contact support immediately.",
    url: "/dashboard",
    tag: `pwd-changed-${Date.now()}`,
  };
  sendPushToUser(user._id, payload, "account").catch((err) => console.error("Error sending password reset push alert:", err));

  res.status(200).json({
    success: true,
    message: "Password reset successful.",
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, age, gender, removeImage } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  user.name = name ?? user.name;
  user.phone = phone ?? user.phone;
  user.age = age ?? user.age;
  user.gender = gender ?? user.gender;

  // Handle profile image removal
  if (removeImage === "true" || removeImage === true) {
    if (user.image) {
      await deleteFromCloudinary(user.image);
      user.image = "";
    }
  }

  if (req.file) {
    if (req.file.size > 5 * 1024 * 1024) {
      throw new ApiError(400, "Image size must be under 5MB.");
    }
    
    // Delete old profile image if it exists
    if (user.image) {
      await deleteFromCloudinary(user.image);
    }

    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      "physio-clinic/users"
    );
    user.image = uploaded.secure_url;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      age: user.age,
      gender: user.gender,
      role: user.role,
      image: user.image,
    },
  });
});

// Change Password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(
      400,
      "Current password and new password are required."
    );
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isMatch = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect.");
  }

  user.password = await bcrypt.hash(newPassword, 10);

  await user.save();

  const payload = {
    title: "Password Changed",
    body: "Your account password was updated successfully. If this wasn't you, please contact support immediately.",
    url: "/dashboard",
    tag: `pwd-changed-${Date.now()}`,
  };
  sendPushToUser(user._id, payload, "account").catch((err) => console.error("Error sending password change push alert:", err));

  res.status(200).json({
    success: true,
    message: "Password changed successfully.",
  });
});