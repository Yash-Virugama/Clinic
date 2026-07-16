import { useState, useEffect } from "react";

export const useIsPWA = () => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkPWA = () => {
      const matchMediaCheck = window.matchMedia("(display-mode: standalone)").matches;
      const navigatorCheck = !!window.navigator.standalone;
      setIsStandalone(matchMediaCheck || navigatorCheck);
    };

    checkPWA();

    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handler = (e) => setIsStandalone(e.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
    } else {
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, []);

  return isStandalone;
};
