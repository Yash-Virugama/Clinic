import { useState, useEffect } from "react";
import { usePWAInstall } from "../../hooks/usePWAInstall";
import { useIsPWA } from "../../hooks/useIsPWA";
import { FaTimes, FaDownload } from "react-icons/fa";

const PWAInstallBanner = () => {
  const { isInstallable, installPWA } = usePWAInstall();
  const isPwa = useIsPWA();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem("pwa-banner-dismissed");
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("pwa-banner-dismissed", "true");
    setDismissed(true);
  };

  const handleInstall = async () => {
    const success = await installPWA();
    if (success) {
      handleDismiss();
    }
  };

  // If already running as PWA, or not installable, or dismissed, show nothing
  if (isPwa || !isInstallable || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-[26rem] z-[99] bg-white backdrop-blur-[16px] border border-slate-200/80 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.02)] rounded-2xl p-5 transition-all duration-400 ease-out animate-page-entrance">
      <div className="flex gap-4 relative">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/8 text-primary shrink-0">
          <FaDownload className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-heading text-[15px] font-bold text-secondary mb-1">
            Install our Clinic App!
          </h4>
          <p className="font-body text-xs text-text-muted leading-relaxed mb-3.5">
            Access your personalized exercise routines, book slots, and read recovery guides offline.
          </p>
          <div className="flex gap-2.5">
            <button onClick={handleInstall} className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-[0_4px_6px_-1px_rgba(37,99,235,0.15)] transition-all duration-200 cursor-pointer hover:-translate-y-0.5">
              Install App
            </button>
            <button onClick={handleDismiss} className="px-3.5 py-2 bg-slate-200/50 hover:bg-slate-200 text-text-muted hover:text-secondary text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer">
              Not Now
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="absolute -top-1 -right-1 p-1 text-text-muted hover:text-secondary cursor-pointer transition-colors"
          aria-label="Close banner"
        >
          <FaTimes className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
