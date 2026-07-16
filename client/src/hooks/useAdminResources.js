import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const useAdminResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    try {
      const res = await api.get("/resources/admin");
      setResources(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to fetch resources."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return {
    resources,
    loading,
    fetchResources,
  };
};

export default useAdminResources;
