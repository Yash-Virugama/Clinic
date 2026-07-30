import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PWANavigation from "../components/pwa/PWANavigation";
import PWAInstallBanner from "../components/pwa/PWAInstallBanner";
import { useIsPWA } from "../hooks/useIsPWA";
import { useBranding } from "../context/BrandingContext";
import { useAuth } from "../context/AuthContext";
import OfflineView from "../components/pwa/OfflineView";
import { FaChevronLeft, FaUser } from "react-icons/fa";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useBranding();
  const { user, logout } = useAuth();
  const isPwa = useIsPWA();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setSidebarOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getDashboardPath = (userVal) => {
    if (!userVal) return "/login";
    if (userVal.role === "admin") return "/admin";
    if (["assistant", "intern", "physiotherapist", "receptionist"].includes(userVal.role)) {
      return `/staff/${userVal.role}`;
    }
    return "/dashboard";
  };

  const getPanelSidebarLinks = () => {
    const clickHandler = () => setSidebarOpen(false);
    const itemClass = "flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60";

    if (!user) return null;

    if (user.role === "admin") {
      return (
        <>
          <Link to="/admin" onClick={clickHandler} className={itemClass}>
            <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
            </svg>
            <span>Admin Panel</span>
          </Link>
          <Link to="/clinic" onClick={clickHandler} className={itemClass}>
            <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>Clinic Panel</span>
          </Link>
        </>
      );
    }

    if (["assistant", "intern", "physiotherapist", "receptionist"].includes(user.role)) {
      const hasClinicAccess = user.permissions && user.permissions.includes("clinic:dashboard");
      return (
        <>
          <Link to={`/staff/${user.role}`} onClick={clickHandler} className={itemClass}>
            <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Staff Panel</span>
          </Link>
          {hasClinicAccess && (
            <Link to={`/staff/${user.role}/clinic`} onClick={clickHandler} className={itemClass}>
              <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span>Clinic Panel</span>
            </Link>
          )}
        </>
      );
    }

    // Patient
    return (
      <Link to="/dashboard" onClick={clickHandler} className={itemClass}>
        <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>Dashboard</span>
      </Link>
    );
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    // Sync Stable Manifest Link immediately on mount
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      document.head.appendChild(manifestLink);
    }
    const apiBase = import.meta.env.VITE_API_URL || "/api";
    manifestLink.href = `${apiBase}/settings/manifest`;
    manifestLink.removeAttribute("crossorigin");
  }, []);

  useEffect(() => {
    if (settings) {
      const activeName = settings.appName || settings.name || "PhysioCare";
      // 1. Sync Page Title
      document.title = activeName;

      // 2. Sync Favicon Link
      if (settings.favicon) {
        let faviconLink = document.querySelector('link[rel="icon"]');
        if (!faviconLink) {
          faviconLink = document.createElement('link');
          faviconLink.rel = 'icon';
          document.head.appendChild(faviconLink);
        }
        faviconLink.href = settings.favicon;
      }

      // 3. Sync Apple Touch Icon
      const pwaIconSrc = settings.pwaIcon || "/emerald-192.png";
      let appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
      if (!appleIcon) {
        appleIcon = document.createElement('link');
        appleIcon.rel = 'apple-touch-icon';
        document.head.appendChild(appleIcon);
      }
      appleIcon.href = pwaIconSrc;
    }
  }, [settings]);

  const showPWAChrome = isPwa && isMobile;

  return (
    <>
      {/* Dynamic Offline Status Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-white text-[11px] sm:text-xs font-bold py-2.5 px-4 text-center font-heading tracking-wide shadow-sm flex items-center justify-center gap-2 z-50 sticky top-0">
          <span>⚠️ Connection lost. Viewing cached resources and exercise checksheets offline.</span>
        </div>
      )}

      {showPWAChrome ? (
        <>
          <header className="pwa-app-header sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-4 py-3.5 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
              aria-label="Open Sidebar"
            >
              <svg className="w-6 h-6 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-heading text-base font-extrabold tracking-tight text-secondary">
              {settings?.name || "PhysioCare"}
            </span>
            <Link to={getDashboardPath(user)} className="w-10 h-10 rounded-full bg-slate-100 shadow-sm flex items-center justify-center text-slate-600 hover:text-primary hover:bg-slate-200 transition-colors">

              {user?.image ? (
                <img
                  src={user.image}
                  alt="Avatar"
                  className="rounded-full w-full h-full border border-slate-200 object-cover"
                />
              ) : (
                (user?.name ? (
                  <div className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center font-bold text-md text-primary uppercase font-heading">
                    {user.name?.charAt(0) || "A"}
                  </div>
                ) : (
                  <FaUser className="w-5 h-5" />
                ))
              )}

            </Link>
          </header>

          {/* Mobile Overlay Background backdrop */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[55] transition-opacity"
            />
          )}

          {/* Sidebar aside Container */}
          <aside
            className={`w-72 h-screen fixed left-0 top-0 bg-darkblue border-r border-slate-800/80 flex flex-col z-[60] transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Header Brand */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/50">
              <Link to="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                {settings?.logo ? (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow">
                    <img
                      src={settings.logo}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
                    <svg className="w-4 h-4 text-primary stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                )}
                <span className="font-heading text-sm font-bold text-slate-100 tracking-tight leading-none truncate max-w-[150px]">
                  {settings?.name || "PhysioCare"}
                </span>
              </Link>

              {/* Close trigger on Mobile viewports */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                aria-label="Close Sidebar"
              >
                <svg className="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>            {/* Navigation Links - Always styled vertically as a Sidebar */}
            <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto no-scrollbar">
              {/* Home link */}
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              >
                <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <span>Home</span>
              </Link>

              {user ? (
                getPanelSidebarLinks()
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  >
                    <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Login</span>
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  >
                    <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Register</span>
                  </Link>
                </>
              )}
            </nav>

            {/* Footer / Logout Action */}
            {user && (
              <div className="p-4 bg-[#090d16] border-t border-slate-800/50">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 px-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-premium cursor-pointer"
                >
                  <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </aside>
        </>
      ) : (
        <Navbar />
      )}

      <main
        key={location.pathname}
        className={`animate-page-entrance ${showPWAChrome ? "pb-[61px]" : ""}`}
      >
        <Outlet />
      </main>

      {showPWAChrome ? (
        <PWANavigation />
      ) : (
        !isPwa && <Footer />
      )}

      <PWAInstallBanner />
    </>
  );
};

export default MainLayout;