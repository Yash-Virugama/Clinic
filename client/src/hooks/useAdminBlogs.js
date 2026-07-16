import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const useAdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blogs/admin");
      setBlogs(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to fetch blogs."
      );
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

export default useAdminBlogs;