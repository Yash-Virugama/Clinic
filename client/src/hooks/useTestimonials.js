import { useEffect, useState } from "react";
import api from "../api/axios";

const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await api.get("/testimonials");
      setTestimonials(res.data);
      localStorage.setItem("cached_testimonials", JSON.stringify(res.data));
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
      const cached = localStorage.getItem("cached_testimonials");
      if (cached) {
        setTestimonials(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return {
    testimonials,
    loading,
    fetchTestimonials,
  };
};

export default useTestimonials;