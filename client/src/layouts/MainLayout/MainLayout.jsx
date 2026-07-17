import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import PWANavigation from "../../components/PWANavigation/PWANavigation.jsx";
import PWAInstallBanner from "../../components/PWAInstallBanner/PWAInstallBanner.jsx";
import { useIsPWA } from "../../hooks/useIsPWA";
import { useBranding } from "../../context/BrandingContext";
import { useAuth } from "../../context/AuthContext";
import OfflineView from "../../components/OfflineView/OfflineView.jsx";
import { FaChevronLeft, FaUser } from "react-icons/fa";
import "./MainLayout.css";

const parseHsl = (hslString) => {
  try {
    let clean = hslString.toLowerCase().replace(/hsl\(|\)|%|deg/g, "").replace(/,/g, " ").trim();
    let parts = clean.split(/\s+/);
    if (parts.length >= 3) {
      let h = parseInt(parts[0], 10);
      let s = parseInt(parts[1], 10);
      let l = parseInt(parts[2], 10);
      if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
        return { h, s, l };
      }
    }
  } catch (e) {
    console.error("Failed to parse HSL string:", e);
  }
  return null;
};

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useBranding();
  const { user } = useAuth();
  const isPwa = useIsPWA();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    if (settings) {
      const activeName = settings.appName || settings.name || "PhysioCare";
      // 1. Sync Page Title
      document.title = activeName;

      // 2. Sync Theme Color
      const rawThemeColor = settings.primaryColor || "221 83% 53%";
      let h = 221, s = 83, l = 53;
      let themeColor = "hsl(221, 83%, 53%)";

      const parsedHsl = parseHsl(rawThemeColor);
      if (parsedHsl) {
        h = parsedHsl.h;
        s = parsedHsl.s;
        l = parsedHsl.l;
        themeColor = `hsl(${h}, ${s}%, ${l}%)`;
      }

      document.documentElement.style.setProperty('--primary-h', `${h}`);
      document.documentElement.style.setProperty('--primary-s', `${s}%`);
      document.documentElement.style.setProperty('--primary-l', `${l}%`);
      document.documentElement.style.setProperty('--primary', themeColor);
      document.documentElement.style.setProperty('--primary-hover', `hsl(${h}, ${s}%, ${Math.max(0, l - 8)}%)`);

      // 3. Sync Meta Theme Color
      let themeMeta = document.querySelector('meta[name="theme-color"]');
      if (!themeMeta) {
        themeMeta = document.createElement('meta');
        themeMeta.name = 'theme-color';
        document.head.appendChild(themeMeta);
      }
      themeMeta.content = themeColor;

      // 4. Sync Favicon Link
      if (settings.favicon) {
        let faviconLink = document.querySelector('link[rel="icon"]');
        if (!faviconLink) {
          faviconLink = document.createElement('link');
          faviconLink.rel = 'icon';
          document.head.appendChild(faviconLink);
        }
        faviconLink.href = settings.favicon;
      }

      // 5. Sync Apple Touch Icon
      const pwaIconSrc = settings.pwaIcon || "/emerald-192.png";
      let appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
      if (!appleIcon) {
        appleIcon = document.createElement('link');
        appleIcon.rel = 'apple-touch-icon';
        document.head.appendChild(appleIcon);
      }
      appleIcon.href = pwaIconSrc;

      // 6. Dynamic Manifest Generation
      const manifest = {
        name: activeName,
        short_name: settings.shortName || settings.name || "PhysioCare",
        description: "Professional Physiotherapy Clinic",
        theme_color: themeColor,
        background_color: "#f8fafc",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: pwaIconSrc,
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: pwaIconSrc,
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      };

      const stringManifest = JSON.stringify(manifest);
      const blob = new Blob([stringManifest], { type: 'application/json' });
      const manifestURL = URL.createObjectURL(blob);

      let manifestLink = document.querySelector('link[rel="manifest"]');
      if (!manifestLink) {
        manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        document.head.appendChild(manifestLink);
      }
      manifestLink.href = manifestURL;

      return () => {
        URL.revokeObjectURL(manifestURL);
      };
    }
  }, [settings]);

  const showPWAChrome = isPwa && isMobile;

  return (
    <>
      {showPWAChrome ? (
        <header className="pwa-app-header sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-4 py-3.5 flex items-center justify-between">
          {location.pathname !== '/' ? (
            <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors cursor-pointer shrink-0">
                <FaChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-8" />
          )}
          <span className="font-heading text-base font-extrabold tracking-tight text-secondary">
            {settings?.name || "PhysioCare"}
          </span>
          <Link to={user?.role === "admin" ? "/admin" : "/dashboard"} className="w-9 h-9 rounded-full bg-slate-100 shadow-sm flex items-center justify-center text-slate-600 hover:text-primary hover:bg-slate-200 transition-colors">
            
            {user?.image ? (
                <img
                src={user.image}
                alt="Avatar"
                className="rounded-full border border-slate-200 object-cover"
                />
               ) : (
                <FaUser className="w-4 h-4" />
              )}
            
          </Link>
        </header>
      ) : (
        <Navbar />
      )}

      <main 
        key={location.pathname} 
        className={`animate-page-entrance ${showPWAChrome ? "pb-20" : ""}`}
      >
        {isOnline ? <Outlet /> : <OfflineView />}
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