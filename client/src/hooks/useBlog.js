import { useEffect, useState } from "react";
import api from "../api/axios";

const useBlog = (slug) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/blogs/${slug}`);
      setBlog(res.data);
      localStorage.setItem(`cached_blog_${slug}`, JSON.stringify(res.data));
    } catch (error) {
      console.error("Failed to fetch blog article:", error);
      const cached = localStorage.getItem(`cached_blog_${slug}`);
      if (cached) {
        setBlog(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  return {
    blog,
    loading,
    fetchBlog,
  };
};

export default useBlog;