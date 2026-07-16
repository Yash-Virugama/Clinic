import { useState, useEffect } from "react";
import "./PWAInstallBanner.css";
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
    <div className="pwa-install-banner animate-pwa-slide-up">
      <div className="pwa-banner-content">
        <div className="pwa-banner-icon">
          <FaDownload className="w-5 h-5 text-primary" />
        </div>
        <div className="pwa-banner-text">
          <h4>Install our Clinic App!</h4>
          <p>
            Access your personalized exercise routines, book slots, and read recovery guides offline.
          </p>
          <div className="pwa-banner-actions">
            <button onClick={handleInstall} className="pwa-btn-install">
              Install App
            </button>
            <button onClick={handleDismiss} className="pwa-btn-dismiss">
              Not Now
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="pwa-banner-close"
          aria-label="Close banner"
        >
          <FaTimes className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
