import webpush from "web-push";
import { PushSubscription } from "../models/pushSubscription.js";
import { User } from "../models/user.js";

// Initialize VAPID details
const initWebPush = () => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:admin@clinic.com";

  if (!publicKey || !privateKey) {
    console.warn("WARNING: Web Push VAPID keys are missing in environment variables. Push notifications will not be sent.");
    return false;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
};

const isConfigured = initWebPush();

/**
 * Sends a push notification to a single browser subscription.
 * Automatically deletes the subscription from MongoDB if it has expired or is invalid (HTTP 404/410).
 * @param {Object} subscription - Mongoose PushSubscription document or Web Push subscription object
 * @param {Object} payload - Notification payload object { title, body, url, tag, badge, icon, data }
 */
export const sendPushNotification = async (subscription, payload) => {
  if (!isConfigured) {
    console.error("Web Push is not configured. Skipping sending.");
    return false;
  }

  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  };

  try {
    await webpush.sendNotification(pushSubscription, JSON.stringify(payload));
    return true;
  } catch (error) {
    // If the endpoint is expired or invalid, remove it from database
    if (error.statusCode === 410 || error.statusCode === 404) {
      console.log(`Push endpoint expired or invalid (HTTP ${error.statusCode}). Pruning from MongoDB: ${subscription.endpoint}`);
      try {
        await PushSubscription.deleteOne({ endpoint: subscription.endpoint });
      } catch (dbErr) {
        console.error("Failed to delete stale push subscription:", dbErr);
      }
    } else {
      console.error(`Error sending push notification to endpoint ${subscription.endpoint}:`, error.message || error);
    }
    return false;
  }
};

/**
 * Sends a push notification to all subscriptions of a specific user.
 * Respects user notification preferences.
 * @param {string} userId - ID of the user
 * @param {Object} payload - Notification payload
 * @param {string} category - Category ('appointments', 'blogs', 'resources', 'account')
 */
export const sendPushToUser = async (userId, payload, category) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log(`User ${userId} not found. Skipping push notification.`);
      return;
    }

    // Check preferences (general account security alerts bypass mute if category is account, but check other settings)
    if (category && user.notificationPreferences) {
      const preferenceValue = user.notificationPreferences[category];
      if (preferenceValue === false) {
        console.log(`User ${user.email} has disabled '${category}' notifications. Skipping push notification.`);
        return;
      }
    }

    const subscriptions = await PushSubscription.find({ user: userId });
    if (subscriptions.length === 0) {
      return;
    }

    const promises = subscriptions.map((sub) => sendPushNotification(sub, payload));
    await Promise.allSettled(promises);
  } catch (error) {
    console.error(`Error in sendPushToUser for user ${userId}:`, error);
  }
};

/**
 * Sends a push notification to all users who have enabled the given category.
 * @param {Object} payload - Notification payload
 * @param {string} category - Category ('appointments', 'blogs', 'resources', 'account')
 */
export const sendPushToAll = async (payload, category) => {
  try {
    const subscriptions = await PushSubscription.find().populate("user");
    if (subscriptions.length === 0) {
      return;
    }

    // Filter by notification preferences
    const validSubscriptions = subscriptions.filter((sub) => {
      if (!sub.user) {
        // Orphaned subscription without a valid user
        return true;
      }
      if (category && sub.user.notificationPreferences) {
        return sub.user.notificationPreferences[category] !== false;
      }
      return true;
    });

    if (validSubscriptions.length === 0) {
      return;
    }

    // Send notifications in batches of 10 to be gentle on CPU and network
    const batchSize = 10;
    for (let i = 0; i < validSubscriptions.length; i += batchSize) {
      const batch = validSubscriptions.slice(i, i + batchSize);
      const promises = batch.map((sub) => sendPushNotification(sub, payload));
      await Promise.allSettled(promises);
    }
  } catch (error) {
    console.error("Error in sendPushToAll:", error);
  }
};
