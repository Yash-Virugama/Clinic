import { PushSubscription } from "../models/pushSubscription.js";
import { User } from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { subscriptionSchema, sendNotificationSchema } from "../validations/notificationSchema.js";
import { sendPushToUser, sendPushToAll } from "../utils/pushNotification.js";

// @desc    Subscribe to push notifications
// @route   POST /api/notifications/subscribe
// @access  Private
export const subscribe = asyncHandler(async (req, res) => {
  // Validate incoming subscription data
  const validatedData = subscriptionSchema.parse(req.body);

  const { endpoint, keys } = validatedData;
  const userAgent = req.headers["user-agent"] || "";

  // Upsert the subscription (update if endpoint already exists)
  const subscription = await PushSubscription.findOneAndUpdate(
    { endpoint },
    {
      user: req.user._id,
      keys,
      userAgent,
    },
    { new: true, upsert: true }
  );

  res.status(201).json({
    success: true,
    message: "Subscribed to push notifications successfully.",
    data: subscription,
  });
});

// @desc    Unsubscribe from push notifications
// @route   POST /api/notifications/unsubscribe
// @access  Private
export const unsubscribe = asyncHandler(async (req, res) => {
  const { endpoint } = req.body;

  if (!endpoint) {
    throw new ApiError(400, "Endpoint is required to unsubscribe.");
  }

  // Delete matching subscription for current user
  const result = await PushSubscription.deleteOne({
    endpoint,
    user: req.user._id,
  });

  if (result.deletedCount === 0) {
    throw new ApiError(404, "Subscription not found for this device.");
  }

  res.status(200).json({
    success: true,
    message: "Unsubscribed from push notifications successfully.",
  });
});

// @desc    Get subscription status and user preferences
// @route   POST /api/notifications/status
// @access  Private
export const getStatus = asyncHandler(async (req, res) => {
  const { endpoint } = req.body;

  let isSubscribed = false;
  if (endpoint) {
    const subscription = await PushSubscription.findOne({
      endpoint,
      user: req.user._id,
    });
    isSubscribed = !!subscription;
  }

  res.status(200).json({
    success: true,
    isSubscribed,
    preferences: req.user.notificationPreferences || {
      appointments: true,
      blogs: true,
      resources: true,
      account: true,
    },
  });
});

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
export const updatePreferences = asyncHandler(async (req, res) => {
  const { preferences } = req.body;

  if (!preferences) {
    throw new ApiError(400, "Preferences object is required.");
  }

  // Update user's preferences
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  user.notificationPreferences = {
    appointments: preferences.appointments ?? user.notificationPreferences.appointments,
    blogs: preferences.blogs ?? user.notificationPreferences.blogs,
    resources: preferences.resources ?? user.notificationPreferences.resources,
    account: preferences.account ?? user.notificationPreferences.account,
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Notification preferences updated successfully.",
    preferences: user.notificationPreferences,
  });
});

// @desc    Get all users list (Admin)
// @route   GET /api/notifications/users
// @access  Private/Admin
export const getUsersList = asyncHandler(async (req, res) => {
  // Fetch users with only essential info for the dropdown select list
  const users = await User.find({}, "name email role").sort({ name: 1 });

  res.status(200).json({
    success: true,
    users,
  });
});

// @desc    Send notifications to target users (Admin)
// @route   POST /api/notifications/send
// @access  Private/Admin
export const sendAdminNotification = asyncHandler(async (req, res) => {
  // Validate request body
  const validatedPayload = sendNotificationSchema.parse(req.body);
  const { title, message, targetUrl, recipientType, userId } = validatedPayload;

  const payload = {
    title,
    body: message,
    url: targetUrl || "/dashboard",
    tag: `admin-broadcast-${Date.now()}`,
  };

  if (recipientType === "all") {
    // Send to all users under the 'account' (general clinic updates) category
    await sendPushToAll(payload, "account");
  } else if (recipientType === "admin") {
    // Send only to users with role admin
    const admins = await User.find({ role: "admin" });
    const adminPromises = admins.map((admin) => sendPushToUser(admin._id, payload, "account"));
    await Promise.allSettled(adminPromises);
  } else if (recipientType === "specific") {
    if (!userId) {
      throw new ApiError(400, "User ID is required for recipient type 'specific'.");
    }
    await sendPushToUser(userId, payload, "account");
  } else {
    throw new ApiError(400, "Invalid recipient type specified.");
  }

  res.status(200).json({
    success: true,
    message: "Push notifications dispatched successfully.",
  });
});
