import { useState, useEffect } from "react";

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(window.deferredPrompt || null);
  const [isInstallable, setIsInstallable] = useState(!!window.deferredPrompt);

  useEffect(() => {
    // If already captured by global head script, sync immediately
    if (window.deferredPrompt) {
      setDeferredPrompt(window.deferredPrompt);
      setIsInstallable(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handlePwaReady = () => {
      if (window.deferredPrompt) {
        setDeferredPrompt(window.deferredPrompt);
        setIsInstallable(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("pwa-install-ready", handlePwaReady);

    const handleAppInstalled = () => {
      window.deferredPrompt = null;
      setDeferredPrompt(null);
      setIsInstallable(false);
      console.log("PWA was installed successfully");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("pwa-install-ready", handlePwaReady);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    const promptEvent = deferredPrompt || window.deferredPrompt;
    if (!promptEvent) return false;

    // Show the install prompt
    promptEvent.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await promptEvent.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    window.deferredPrompt = null;
    setDeferredPrompt(null);
    setIsInstallable(false);

    return outcome === "accepted";
  };

  return { isInstallable, installPWA };
};
