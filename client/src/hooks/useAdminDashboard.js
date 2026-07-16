import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const useAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data.stats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPatients = async () => {
  try {
    const response = await api.get("/export/patients", {
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "Patients.xlsx";

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    toast.error("Failed to download patients.");
  }
};

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  

  return {
    stats,
    loading,
    fetchDashboardStats,
    handleDownloadPatients
  };
};

export default useAdminDashboard;