import "./DashboardHome.css";
import { useAuth } from "../../../context/AuthContext";
import { useBranding } from "../../../context/BrandingContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const DashboardHome = () => {
  const { user } = useAuth();
  const { settings } = useBranding();

  // Simulated Registration Date (based on user.createdAt or custom fallback)
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "June 2026";

  // Simulated Patient ID
  const patientId = `PT-${(user?._id || "5523").substring(0, 4).toUpperCase()}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col gap-8 text-left">

      {/* Welcome Banner Header */}
      <div>
        <span className="inline-block text-primary text-[10px] font-bold tracking-wider uppercase mb-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 font-accent animate-pulse">
          Patient Profile
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-secondary font-heading mb-2">
          Welcome Back, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{user?.name || "Patient"}</span>! 👋
        </h1>
        <p className="text-xs sm:text-sm text-text-muted font-body leading-relaxed max-w-xl">
          Coordinate your therapy schedule, download reference stretching checksheets, or view active rehabilitation status records below.
        </p>
      </div>

      {/* Main Dashboard Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

        {/* Left Column: Digital Health Card & Progress Tracker (col-span-7) */}
        <div className="md:col-span-7 flex flex-col gap-6.5 w-full">

          {/* Visual Clinic Health ID Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0c1220] to-[#1e293b] text-white rounded-[28px] p-6.5 shadow-xl border border-slate-800/80 group">

            {/* Watermark Blueprint Spine Grid Overlay */}
            <div className="absolute inset-0 bg-grid-blueprint-dark opacity-10 pointer-events-none" />
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-primary/20 blur-[50px] pointer-events-none" />
            <div className="absolute -left-10 -top-10 w-44 h-44 rounded-full bg-accent/20 blur-[50px] pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-between h-full min-h-[190px]">
              {/* Top Row: Brand & ID Number */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white font-bold text-xs">
                    ✚
                  </div>
                  <span className="font-extrabold text-xs tracking-wider uppercase font-heading">
                    {settings?.name || "PhysioCare"} ID CARD
                  </span>
                </div>
                <span className="font-mono text-xs font-semibold text-slate-400 tracking-wider hidden sm:block">
                  {patientId}
                </span>
              </div>

              {/* Middle Row: Photo and Personal Identifiers */}
              <div className="flex items-center gap-4.5 mb-6">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700/60 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-400 border border-slate-700 shrink-0">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col">
                  <h3 className="text-md font-bold tracking-tight font-heading mb-0.5">
                    {user?.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-body uppercase tracking-wider mb-1.5">
                    Registered Patient
                  </span>
                </div>
              </div>

              {/* Bottom Row: Metadata details */}
              <div className="border-t border-slate-800 pt-4 grid grid-cols-3 gap-2">
                <div>
                  <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-heading mb-0.5">Age</span>
                  <span className="text-xs font-bold text-slate-300 font-body">{user?.age || "N/A"} Yrs</span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-heading mb-0.5">Gender</span>
                  <span className="text-xs font-bold text-slate-300 font-body uppercase">{user?.gender || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-heading mb-0.5">Member Since</span>
                  <span className="text-xs font-bold text-slate-300 font-body">{memberSince}</span>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Right Column: Contact Records & Quick Access Actions (col-span-5) */}
        <div className="md:col-span-5 flex flex-col gap-6.5 w-full">

          {/* Personal Record Badges */}
          <div className="bg-white border border-slate-200/70 rounded-[28px] p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-secondary tracking-tight font-heading mb-1">
              Contact Directory Records
            </h3>

            <div className="flex flex-col gap-3">
              {/* Phone Line */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-heading">Phone Contact</span>
                  <span className="text-xs font-bold text-secondary font-body">{user?.phone || "No phone added"}</span>
                </div>
              </div>

              {/* Email Address */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-heading">Email Address</span>
                  <span className="text-xs font-bold text-secondary font-body break-all">{user?.email || "No email added"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Shortcuts */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase pl-2">
              Hub Shortcuts
            </h3>

            {/* Shortcut 1 */}
            <Link
              to="/resources"
              className="group bg-white hover:bg-slate-50 border border-slate-200/70 p-4.5 rounded-2.5xl flex items-center justify-between shadow-sm transition-premium"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  📂
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-secondary font-heading group-hover:text-primary transition-all">
                    Exercise Guides
                  </span>
                  <span className="text-[10px] text-text-muted font-body">
                    Download clinical exercise PDFs
                  </span>
                </div>
              </div>
              <svg className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Shortcut 2 */}
            <Link
              to="/contact"
              className="group bg-white hover:bg-slate-50 border border-slate-200/70 p-4.5 rounded-2.5xl flex items-center justify-between shadow-sm transition-premium"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  📅
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-secondary font-heading group-hover:text-primary transition-all">
                    Appointment Office
                  </span>
                  <span className="text-[10px] text-text-muted font-body">
                    Send booking request messages
                  </span>
                </div>
              </div>
              <svg className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Shortcut 3 */}
            <Link
              to="/dashboard/update-profile"
              className="group bg-white hover:bg-slate-50 border border-slate-200/70 p-4.5 rounded-2.5xl flex items-center justify-between shadow-sm transition-premium"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  ⚙️
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-secondary font-heading group-hover:text-primary transition-all">
                    Edit Profile Credentials
                  </span>
                  <span className="text-[10px] text-text-muted font-body">
                    Update phone, age, or avatars
                  </span>
                </div>
              </div>
              <svg className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardHome;