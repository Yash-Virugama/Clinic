import { useEffect, useState } from "react";
import api from "../api/axios";

const useResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await api.get("/resources");
      setResources(res.data);
      localStorage.setItem("cached_resources", JSON.stringify(res.data));
    } catch (error) {
      console.error("Failed to fetch resources:", error);
      const cached = localStorage.getItem("cached_resources");
      if (cached) {
        setResources(JSON.parse(cached));
      }
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

export default useResources;