import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { usePushNotifications } from "../../../hooks/usePushNotifications";

const ClinicHeader = ({ onMenuClick }) => {
  const { user } = useAuth();
  const location = useLocation();
  const profilePath = user?.role === "admin" ? "/admin/profile" : `/staff/${user?.role}/profile`;
  const {
    isSupported,
    isSubscribed,
    needsInstall,
    subscribeUser,
    unsubscribeUser,
  } = usePushNotifications();

  // Determine title based on active path
  const getPageTitle = (path) => {
    if (path.endsWith("/clinic")) {
      return "Clinic Dashboard";
    }
    if (path.endsWith("/clinic/dashboard/visits")) {
      return "Today's Visits";
    }
    if (path.endsWith("/clinic/dashboard/appointments")) {
      return "Today's Appointments";
    }
    if (path.endsWith("/clinic/unpaid")) {
      return "Unpaid Payments";
    }
    if (path.endsWith("/appointments")) {
      return "Appointments";
    }
    if (path.endsWith("/patients")) {
      return "Patient Records";
    }
    if (path.endsWith("/report")) {
      return "Clinic Analytics";
    }
    if (path.includes("/patients/")) {
      return "Patient Workspace";
    }
    if (path.includes("/payments")) {
      return "Clinic Payments";
    }
    return "Clinic Panel";
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4.5 flex items-center justify-between">
      {/* Title with Mobile Hamburger Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100/80 transition-colors cursor-pointer"
          aria-label="Open Sidebar"
        >
          <svg className="w-5.5 h-5.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-accent block leading-none mb-1">
            Clinic Administration
          </span>
          <h1 className="text-base font-bold text-secondary font-heading leading-none">
            {getPageTitle(location.pathname)}
          </h1>
        </div>
      </div>

      {/* User Info / Profile Link */}
      {user && (
        <div className="flex items-center gap-3.5">
          {/* Bell Icon Button */}
          {isSupported && !needsInstall && (
            <button
              onClick={isSubscribed ? unsubscribeUser : subscribeUser}
              title={isSubscribed ? "Mute push notifications on this device" : "Receive push notifications on this device"}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isSubscribed
                  ? "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                  : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-650 hover:bg-slate-100"
              }`}
            >
              <svg className="w-5 h-5 stroke-[2]" fill={isSubscribed ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </button>
          )}

          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-secondary block leading-tight">
              {user.name}
            </span>
            <span className="text-[10px] font-medium text-slate-400 block leading-tight">
              {user.role === "admin" ? "Consulting Doctor" : (user.role.charAt(0).toUpperCase() + user.role.slice(1))}
            </span>
          </div>
          <Link to={profilePath} title="Admin Profile Settings" className="shrink-0">
            {user.image ? (
              <img
                src={user.image}
                alt="Doctor Profile"
                className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm hover:border-primary transition-all duration-200 cursor-pointer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-sm text-primary shadow-inner hover:border-primary transition-all duration-200 cursor-pointer">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>
        </div>
      )}
    </header>
  );
};

export default ClinicHeader;
