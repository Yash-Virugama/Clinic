import { useEffect, useState } from "react";
import api from "../api/axios";

const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/blogs");
      setBlogs(res.data);
      localStorage.setItem("cached_blogs", JSON.stringify(res.data));
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      const cached = localStorage.getItem("cached_blogs");
      if (cached) {
        setBlogs(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return {
    blogs,
    loading,
    fetchBlogs,
  };
};

export default useBlogs;