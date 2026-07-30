import { User } from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

const STAFF_ROLES = ["admin", "assistant", "intern", "physiotherapist", "receptionist"];

// List all staff members
export const getStaff = asyncHandler(async (req, res) => {
  const staff = await User.find({
    role: { $in: STAFF_ROLES },
  })
    .select("-password -passwordResetToken -passwordResetExpires")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    staff,
  });
});

// Update staff role and permissions
export const updateStaffRoleAndPermissions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role, permissions } = req.body;

  if (!role) {
    throw new ApiError(400, "Role is required.");
  }

  if (!STAFF_ROLES.includes(role)) {
    throw new ApiError(400, "Invalid staff role.");
  }

  const staffUser = await User.findById(id);
  if (!staffUser) {
    throw new ApiError(404, "Staff member not found.");
  }

  // Prevent removing the last active admin
  if (staffUser.role === "admin" && role !== "admin" && staffUser.isActive) {
    const activeAdminCount = await User.countDocuments({ role: "admin", isActive: true });
    if (activeAdminCount <= 1) {
      throw new ApiError(400, "Cannot change role. At least one active administrator must remain.");
    }
  }

  staffUser.role = role;
  if (permissions) {
    staffUser.permissions = permissions;
  }

  await staffUser.save();

  res.status(200).json({
    success: true,
    message: "Staff role and permissions updated successfully.",
    user: {
      id: staffUser._id,
      name: staffUser.name,
      email: staffUser.email,
      role: staffUser.role,
      permissions: staffUser.permissions,
    },
  });
});

// Toggle staff active/inactive status
export const toggleStaffStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (isActive === undefined) {
    throw new ApiError(400, "isActive status is required.");
  }

  const staffUser = await User.findById(id);
  if (!staffUser) {
    throw new ApiError(404, "Staff member not found.");
  }

  // Prevent deactivating the last active admin
  if (staffUser.role === "admin" && !isActive) {
    const activeAdminCount = await User.countDocuments({ role: "admin", isActive: true });
    if (activeAdminCount <= 1) {
      throw new ApiError(400, "Cannot deactivate. At least one active administrator must remain.");
    }
  }

  staffUser.isActive = isActive;
  await staffUser.save();

  res.status(200).json({
    success: true,
    message: `Staff member ${isActive ? "activated" : "deactivated"} successfully.`,
    user: {
      id: staffUser._id,
      name: staffUser.name,
      email: staffUser.email,
      role: staffUser.role,
      isActive: staffUser.isActive,
    },
  });
});

// Delete staff member (deactivation strategy)
export const deleteStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const staffUser = await User.findById(id);
  if (!staffUser) {
    throw new ApiError(404, "Staff member not found.");
  }

  // Prevent deactivating the last active admin
  if (staffUser.role === "admin" && staffUser.isActive) {
    const activeAdminCount = await User.countDocuments({ role: "admin", isActive: true });
    if (activeAdminCount <= 1) {
      throw new ApiError(400, "Cannot deactivate. At least one active administrator must remain.");
    }
  }

  staffUser.isActive = false;
  await staffUser.save();

  res.status(200).json({
    success: true,
    message: "Staff member deactivated successfully.",
  });
});
