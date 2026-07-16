import api from "../api/axios";
import toast from "react-hot-toast";

const useContact = () => {
  const sendMessage = async (data) => {
    try {
      const res = await api.post("/contact", data);

      toast.success(res.data.message);

      return res.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send message."
      );

      throw error;
    }
  };

  return {
    sendMessage,
  };
};

export default useContact;