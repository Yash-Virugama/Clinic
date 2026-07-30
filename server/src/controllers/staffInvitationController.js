import crypto from "crypto";
import bcrypt from "bcryptjs";
import { StaffInvitation } from "../models/staffInvitation.js";
import { User } from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import sendEmail from "../utils/sendEmail.js";
import generateToken from "../utils/generateToken.js";

const STAFF_ROLES = ["admin", "assistant", "intern", "physiotherapist", "receptionist"];

// Helper to hash token
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// Send invitation
export const inviteStaff = asyncHandler(async (req, res) => {
  const { email, role, permissions } = req.body;

  if (!email || !role) {
    throw new ApiError(400, "Email and role are required.");
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Whitelist role check
  if (!STAFF_ROLES.includes(role)) {
    throw new ApiError(400, "Invalid staff role.");
  }

  // Check if User already exists
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists.");
  }

  // Delete any existing active pending invitations for this email to avoid duplicates
  await StaffInvitation.deleteMany({ email: normalizedEmail, used: false });

  // Generate secure token
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);

  const expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days

  const invitation = await StaffInvitation.create({
    email: normalizedEmail,
    role,
    permissions: permissions || [],
    token: hashedToken,
    expiresAt,
    invitedBy: req.user._id,
  });

  // Send invitation email
  const registrationUrl = `${process.env.CLIENT_URL}/staff/register/${rawToken}`;
  const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);

  const html = `
    <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #0f172a; margin-top: 0;">You're invited to join PhysioCare</h2>
      <p>Hello,</p>
      <p>You have been invited to join the clinic portal as a <strong>${roleDisplay}</strong>.</p>
      <p>Complete your account setup using the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${registrationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">Create Account</a>
      </div>
      <p style="font-size: 12px; color: #64748b;">Or copy and paste this URL into your browser:</p>
      <p style="font-size: 12px; color: #2563eb; word-break: break-all;">${registrationUrl}</p>
      <p style="font-size: 13px; color: #f59e0b; font-weight: 500;">This invitation link will expire in 15 days.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 11px; color: #94a3b8; margin-bottom: 0;">If you were not expecting this invitation, you can safely ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to: normalizedEmail,
    subject: `You're invited to join PhysioCare as a ${roleDisplay}`,
    html,
  });

  res.status(201).json({
    success: true,
    message: "Staff invitation sent successfully.",
  });
});

// Validate invitation token
export const validateInvitation = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const hashedToken = hashToken(token);

  const invitation = await StaffInvitation.findOne({
    token: hashedToken,
    used: false,
    expiresAt: { $gt: new Date() },
  });

  if (!invitation) {
    throw new ApiError(400, "Invitation is invalid or has expired.");
  }

  res.status(200).json({
    success: true,
    invitation: {
      email: invitation.email,
      role: invitation.role,
      permissions: invitation.permissions,
      expiresAt: invitation.expiresAt,
    },
  });
});

// Accept invitation & Register staff
export const acceptInvitation = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const hashedToken = hashToken(token);

  // Atomic lookup and update to ensure single-use registration behavior
  const invitation = await StaffInvitation.findOneAndUpdate(
    {
      token: hashedToken,
      used: false,
      expiresAt: { $gt: new Date() },
    },
    { used: true },
    { new: true }
  );

  if (!invitation) {
    throw new ApiError(400, "Invitation is invalid or has expired.");
  }

  const { name, password, phone, age, gender } = req.body;

  if (!name || !password || !phone || !age || !gender) {
    // Restore the invitation used status in case of validation error
    await StaffInvitation.findByIdAndUpdate(invitation._id, { used: false });
    throw new ApiError(400, "Please fill all required registration fields.");
  }

  const existingUser = await User.findOne({ email: invitation.email });
  if (existingUser) {
    // Restore the invitation used status
    await StaffInvitation.findByIdAndUpdate(invitation._id, { used: false });
    throw new ApiError(409, "A user with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: invitation.email,
    password: hashedPassword,
    phone,
    age,
    gender,
    role: invitation.role,
    permissions: invitation.permissions,
    isActive: true,
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

// Get invitations list for Admin
export const getInvitations = asyncHandler(async (req, res) => {
  const invitations = await StaffInvitation.find()
    .populate("invitedBy", "name email")
    .sort({ createdAt: -1 });

  const mappedInvitations = invitations.map((inv) => {
    let status = "Pending";
    if (inv.used) {
      status = "Accepted";
    } else if (new Date() > inv.expiresAt) {
      status = "Expired";
    }

    return {
      _id: inv._id,
      email: inv.email,
      role: inv.role,
      permissions: inv.permissions,
      status,
      invitedBy: inv.invitedBy ? { name: inv.invitedBy.name, email: inv.invitedBy.email } : null,
      createdAt: inv.createdAt,
      expiresAt: inv.expiresAt,
    };
  });

  res.status(200).json({
    success: true,
    invitations: mappedInvitations,
  });
});

// Revoke/cancel invitation
export const revokeInvitation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const invitation = await StaffInvitation.findByIdAndDelete(id);

  if (!invitation) {
    throw new ApiError(444, "Invitation not found.");
  }

  res.status(200).json({
    success: true,
    message: "Invitation revoked successfully.",
  });
});

// Resend invitation
export const resendInvitation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const invitation = await StaffInvitation.findById(id);
  if (!invitation) {
    throw new ApiError(404, "Invitation not found.");
  }

  if (invitation.used) {
    throw new ApiError(400, "Cannot resend an already accepted invitation.");
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);

  invitation.token = hashedToken;
  invitation.expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // Reset to another 15 days
  invitation.invitedBy = req.user._id;

  await invitation.save();

  const registrationUrl = `${process.env.CLIENT_URL}/staff/register/${rawToken}`;
  const roleDisplay = invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1);

  const html = `
    <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #0f172a; margin-top: 0;">You're invited to join PhysioCare</h2>
      <p>Hello,</p>
      <p>This is a resent invitation link for complete your account setup as a <strong>${roleDisplay}</strong>.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${registrationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">Create Account</a>
      </div>
      <p style="font-size: 12px; color: #64748b;">Or copy and paste this URL into your browser:</p>
      <p style="font-size: 12px; color: #2563eb; word-break: break-all;">${registrationUrl}</p>
      <p style="font-size: 13px; color: #f59e0b; font-weight: 500;">This invitation link will expire in 15 days.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 11px; color: #94a3b8; margin-bottom: 0;">If you were not expecting this invitation, you can safely ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to: invitation.email,
    subject: `Resent: You're invited to join PhysioCare as a ${roleDisplay}`,
    html,
  });

  res.status(200).json({
    success: true,
    message: "Invitation resent successfully.",
  });
});
