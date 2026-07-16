import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const useAdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data.services);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch services.");
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

export default useAdminServices;