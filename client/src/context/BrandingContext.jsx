import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import Loader from "../components/Loader/Loader";

const BrandingContext = createContext(null);

export const BrandingProvider = ({ children }) => {
  const [settings, setSettings] = useState({ name: "PhysioCare", logo: "" });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/settings");
      setSettings(res.data);
      localStorage.setItem("cached_settings", JSON.stringify(res.data));
    } catch (error) {
      console.error("Failed to fetch branding settings:", error);
      const cached = localStorage.getItem("cached_settings");
      if (cached) {
        setSettings(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  const updateBranding = async (formData) => {
    const res = await api.put("/settings", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setSettings(res.data.settings);
    return res.data;
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <BrandingContext.Provider value={{ settings, loading, fetchSettings, updateBranding }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error("useBranding must be used within a BrandingProvider");
  }
  return context;
};
