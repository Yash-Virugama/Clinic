import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const useAdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const res = await api.get("/contact");
      setContacts(res.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to fetch contacts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts,
    loading,
    fetchContacts,
  };
};

export default useAdminContacts;