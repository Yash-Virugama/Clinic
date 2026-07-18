import { useEffect, useState } from "react";
import { usePushNotifications } from "../../../hooks/usePushNotifications";
import { FaCalendarCheck, FaFolderOpen, FaNewspaper, FaShieldAlt } from "react-icons/fa";

const DashboardNotifications = () => {
  const {
    isSupported,
    permission,
    isSubscribed,
    loading,
    needsInstall,
    preferences,
    subscribeUser,
    unsubscribeUser,
    savePreferences,
  } = usePushNotifications();

  const [localPrefs, setLocalPrefs] = useState({
    appointments: true,
    blogs: true,
    resources: true,
    account: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (preferences) {
      setLocalPrefs({
        appointments: preferences.appointments ?? true,
        blogs: preferences.blogs ?? true,
        resources: preferences.resources ?? true,
        account: preferences.account ?? true,
      });
    }
  }, [preferences]);

  const handleTogglePreference = (key) => {
    setLocalPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    await savePreferences(localPrefs);
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-136px)] xl:h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 font-accent">
          Syncing notification settings...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left max-w-3xl mx-auto">
      {/* Header Info */}
      <div>
        <span className="inline-block text-primary text-[10px] font-bold tracking-wider uppercase mb-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 font-accent animate-pulse">
          Preferences
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-secondary font-heading mb-2">
          Notification Settings
        </h1>
        <p className="text-xs sm:text-sm text-text-muted font-body leading-relaxed">
          Manage how and when you receive real-time push alerts from the clinic on this device.
        </p>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white/85 border border-slate-200/60 backdrop-blur-md rounded-[32px] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-primary/5 blur-[50px] pointer-events-none" />

        {/* 1. Device Subscription Status Panel */}
        <div className="pb-6 sm:pb-8 border-b border-slate-100 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-secondary font-heading mb-1">
                Push Notifications on This Device
              </h3>
              <p className="text-xs text-text-muted leading-relaxed max-w-md">
                Enable this option to receive updates directly on your phone, tablet, or browser even when the application is closed.
              </p>
            </div>
            
            {/* Status indicator pill */}
            <div className="shrink-0 flex items-center">
              {needsInstall ? (
                <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-bold uppercase tracking-wider">
                  Action Required
                </span>
              ) : !isSupported ? (
                <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  Not Supported
                </span>
              ) : isSubscribed ? (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                  Active / Enabled
                </span>
              ) : permission === "denied" ? (
                <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold uppercase tracking-wider">
                  Blocked
                </span>
              ) : (
                <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  Inactive / Off
                </span>
              )}
            </div>
          </div>

          {/* Action Trigger Buttons based on state */}
          <div className="w-full">
            {needsInstall ? (
              <div className="p-4.5 rounded-2xl bg-amber-500/10 border border-amber-200/50 text-amber-700">
                <h4 className="text-xs font-bold font-heading mb-1">iOS Home Screen Installation Needed</h4>
                <p className="text-[11px] font-body leading-relaxed">
                  Web Push Notifications on Apple iOS require this Progressive Web App (PWA) to be installed. Please tap the browser <strong>Share</strong> button and select <strong>Add to Home Screen</strong> to run the app in standalone mode.
                </p>
              </div>
            ) : !isSupported ? (
              <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-500 text-xs font-medium">
                Push Notifications are not supported by your current browser or device. Try using Google Chrome, Microsoft Edge, or Mozilla Firefox.
              </div>
            ) : permission === "denied" ? (
              <div className="p-4.5 rounded-2xl bg-rose-500/10 border border-rose-200/50 text-rose-700 flex flex-col gap-2">
                <h4 className="text-xs font-bold font-heading">Notifications Blocked</h4>
                <p className="text-[11px] font-body leading-relaxed">
                  You have blocked notifications for this site. To enable them, please open your browser's site settings (usually by clicking the lock icon next to the URL) and reset permission for notifications to "Allow".
                </p>
              </div>
            ) : isSubscribed ? (
              <button
                type="button"
                onClick={unsubscribeUser}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100/80 text-rose-600 font-accent text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:shadow"
              >
                Disable Push Notifications
              </button>
            ) : (
              <button
                type="button"
                onClick={subscribeUser}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-primary hover:bg-primary/95 text-white border border-primary text-xs font-bold uppercase tracking-wider transition-premium cursor-pointer shadow-lg shadow-primary/10 hover:shadow-primary/25 hover:scale-[1.01]"
              >
                Enable Notifications
              </button>
            )}
          </div>
        </div>

        {/* 2. Channel Preferences Toggles Form */}
        <form onSubmit={handleSavePreferences} className="pt-6 sm:pt-8 flex flex-col gap-6.5">
          <div>
            <h3 className="text-sm font-bold text-secondary font-heading mb-1">
              Select What You Receive
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              If push notifications are enabled above, you can customize which categories of messages get dispatched to your devices.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Preference 1: Appointments */}
            <div className="flex gap-3 items-center justify-between py-3 sm:p-4.5 sm:rounded-3xl sm:border sm:border-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <FaCalendarCheck className="w-4.5 h-4.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-secondary font-heading">Appointment Alerts & Reminders</span>
                  <span className="text-[10px] text-text-muted font-body">Booking updates, confirmations, and tomorrow alerts</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePreference("appointments")}
                disabled={!isSubscribed}
                className={`shrink-0 w-11 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ${!isSubscribed ? "bg-slate-100 opacity-50 cursor-not-allowed" : localPrefs.appointments ? "bg-primary" : "bg-slate-200"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${localPrefs.appointments ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Preference 2: Resources */}
            <div className="flex gap-3 items-center justify-between py-3 sm:p-4.5 sm:rounded-3xl sm:border sm:border-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                  <FaFolderOpen className="w-4.5 h-4.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-secondary font-heading">New Stretching & Resource Sheets</span>
                  <span className="text-[10px] text-text-muted font-body">Alerts when physical therapists upload exercise guides</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePreference("resources")}
                disabled={!isSubscribed}
                className={`shrink-0 w-11 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ${!isSubscribed ? "bg-slate-100 opacity-50 cursor-not-allowed" : localPrefs.resources ? "bg-primary" : "bg-slate-200"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${localPrefs.resources ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Preference 3: Blogs */}
            <div className="flex gap-3 items-center justify-between py-3 sm:p-4.5 sm:rounded-3xl sm:border sm:border-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                  <FaNewspaper className="w-4.5 h-4.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-secondary font-heading">New Blog Posts & Articles</span>
                  <span className="text-[10px] text-text-muted font-body">Alerts when wellness or rehabilitation guides are published</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePreference("blogs")}
                disabled={!isSubscribed}
                className={`shrink-0 w-11 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ${!isSubscribed ? "bg-slate-100 opacity-50 cursor-not-allowed" : localPrefs.blogs ? "bg-primary" : "bg-slate-200"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${localPrefs.blogs ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Preference 4: Account/Security */}
            <div className="flex gap-3 items-center justify-between py-3 sm:p-4.5 sm:rounded-3xl sm:border sm:border-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <FaShieldAlt className="w-4.5 h-4.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-secondary font-heading">Account & Security Alerts</span>
                  <span className="text-[10px] text-text-muted font-body">Crucial warnings about password updates and security activity</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePreference("account")}
                disabled={!isSubscribed}
                className={`shrink-0 w-11 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ${!isSubscribed ? "bg-slate-100 opacity-50 cursor-not-allowed" : localPrefs.account ? "bg-primary" : "bg-slate-200"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${localPrefs.account ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          </div>

          {/* Save Action Button */}
          <button
            type="submit"
            disabled={!isSubscribed}
            className={`w-full py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-premium mt-2 ${!isSubscribed
              ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60"
              : "bg-primary hover:bg-primary/95 text-white border border-primary shadow-lg shadow-primary/10 hover:shadow-primary/25 hover:scale-[1.01] cursor-pointer"
            }`}
          >
            Save Preferences
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardNotifications;
