import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// Helper function to convert base64 VAPID public key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const usePushNotifications = () => {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [needsInstall, setNeedsInstall] = useState(false); // iOS PWA detection

  const [preferences, setPreferences] = useState({
    appointments: true,
    blogs: true,
    resources: true,
    account: true,
  });

  // Check support and setup state
  useEffect(() => {
    const checkSupport = async () => {
      const swSupported = "serviceWorker" in navigator;
      const pushSupported = "PushManager" in window;
      const notificationSupported = "Notification" in window;
      const supported = swSupported && pushSupported && notificationSupported;

      setIsSupported(supported);

      // iOS PWA Detection
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
      const needsHomeInstall = isIOS && !isStandalone;
      setNeedsInstall(needsHomeInstall);

      if (supported) {
        setPermission(window.Notification.permission);
        await checkSubscriptionStatus();
      } else {
        setLoading(false);
      }
    };

    if (user) {
      checkSupport();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Check subscription status from server and sync preferences
  const checkSubscriptionStatus = async () => {
    try {
      if (!("serviceWorker" in navigator)) {
        setLoading(false);
        return;
      }

      // Check if registration exists first to avoid hanging on .ready in dev mode
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        // Fallback to fetch preferences directly
        const response = await api.post("/notifications/status", { endpoint: null });
        setIsSubscribed(false);
        if (response.data.preferences) {
          setPreferences(response.data.preferences);
        }
        setLoading(false);
        return;
      }

      const activeReg = await navigator.serviceWorker.ready;
      const subscription = await activeReg.pushManager.getSubscription();

      const response = await api.post("/notifications/status", {
        endpoint: subscription ? subscription.endpoint : null,
      });

      setIsSubscribed(response.data.isSubscribed);
      if (response.data.preferences) {
        setPreferences(response.data.preferences);
      }
    } catch (error) {
      console.error("Error checking push status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe user to push notifications
  const subscribeUser = async () => {
    if (!isSupported) {
      toast.error("Push notifications are not supported on this browser.");
      return false;
    }

    if (needsInstall) {
      toast.error("Please add this app to your Home Screen first to enable notifications.");
      return false;
    }

    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;

      // Request permission
      const result = await window.Notification.requestPermission();
      setPermission(result);

      if (result !== "granted") {
        if (result === "denied") {
          toast.error("Notification permission denied. Please enable it in browser settings.");
        } else {
          toast.error("Notification permission dismissed.");
        }
        setLoading(false);
        return false;
      }

      // Check for public key
      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        throw new Error("VITE_VAPID_PUBLIC_KEY is not defined in frontend environment variables.");
      }

      // Subscribe to PushManager
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      };

      const subscription = await registration.pushManager.subscribe(subscribeOptions);

      // Send subscription to backend
      const res = await api.post("/notifications/subscribe", subscription);
      setIsSubscribed(true);
      toast.success("Push notifications enabled successfully!");
      return true;
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
      toast.error(error.message || "Failed to enable notifications.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Unsubscribe user
  const unsubscribeUser = async () => {
    if (!isSupported) return false;
    setLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Unsubscribe from browser push manager
        await subscription.unsubscribe();

        // Remove from backend database
        await api.post("/notifications/unsubscribe", {
          endpoint: subscription.endpoint,
        });
      }

      setIsSubscribed(false);
      toast.success("Push notifications disabled successfully.");
      return true;
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error);
      toast.error("Failed to disable notifications.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Save preferences
  const savePreferences = async (updatedPrefs) => {
    setLoading(true);
    try {
      const res = await api.put("/notifications/preferences", {
        preferences: updatedPrefs,
      });
      setPreferences(res.data.preferences);
      toast.success("Notification preferences updated.");
      return true;
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      toast.error("Failed to save preferences.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    isSupported,
    permission,
    isSubscribed,
    loading,
    needsInstall,
    preferences,
    subscribeUser,
    unsubscribeUser,
    savePreferences,
    refreshStatus: checkSubscriptionStatus,
  };
};
