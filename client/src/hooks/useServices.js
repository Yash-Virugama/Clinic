import { useEffect, useState } from "react";
import api from "../api/axios";

const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/services");
      setServices(res.data.services);
      localStorage.setItem("cached_services", JSON.stringify(res.data.services));
    } catch (error) {
      console.error("Failed to fetch services:", error);
      const cached = localStorage.getItem("cached_services");
      if (cached) {
        setServices(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    fetchServices,
  };
};

export default useServices;