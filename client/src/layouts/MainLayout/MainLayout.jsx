import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import PWANavigation from "../../components/PWANavigation/PWANavigation.jsx";
import PWAInstallBanner from "../../components/PWAInstallBanner/PWAInstallBanner.jsx";
import { useIsPWA } from "../../hooks/useIsPWA";
import { useBranding } from "../../context/BrandingContext";
import { FaChevronLeft, FaUser } from "react-icons/fa";
import "./MainLayout.css";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useBranding();
  const isPwa = useIsPWA();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (settings && settings.name) {
      // 1. Sync Page Title
      document.title = settings.name;

      // 2. Sync Meta Theme Color
      let themeMeta = document.querySelector('meta[name="theme-color"]');
      if (!themeMeta) {
        themeMeta = document.createElement('meta');
        themeMeta.name = 'theme-color';
        document.head.appendChild(themeMeta);
      }
      
      const rootStyle = getComputedStyle(document.documentElement);
      const primaryColor = rootStyle.getPropertyValue('--primary').trim() || '#2563EB';
      themeMeta.content = primaryColor;

      // 3. Dynamic Manifest Generation
      const manifest = {
        name: settings.name,
        short_name: settings.name,
        description: "Professional Physiotherapy Clinic",
        theme_color: primaryColor,
        background_color: "#f8fafc",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/emerald-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "/emerald-512.png",
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
          <Link to="/dashboard" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-primary hover:bg-slate-200 transition-colors">
            <FaUser className="w-3.5 h-3.5" />
          </Link>
        </header>
      ) : (
        <Navbar />
      )}

      <main 
        key={location.pathname} 
        className={`animate-page-entrance ${showPWAChrome ? "pb-20" : ""}`}
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