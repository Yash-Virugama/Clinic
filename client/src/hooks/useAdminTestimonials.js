import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const useAdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get("/testimonials/admin");
      setTestimonials(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to fetch testimonials."
      );
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

export default useAdminTestimonials;