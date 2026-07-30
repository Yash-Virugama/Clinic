import { useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";

const useClinicAppointments = () => {
  const [therapists, setTherapists] = useState([]);
  const [loadingTherapists, setLoadingTherapists] = useState(false);
  const [patientCases, setPatientCases] = useState([]);
  const [loadingCases, setLoadingCases] = useState(false);

  // Fetch all administrative users who can act as therapists
  const fetchTherapists = async () => {
    try {
      setLoadingTherapists(true);
      const res = await api.get("/notifications/users");
      
      // Filter list to keep only users with 'admin' role
      const admins = (res.data.users || []).filter((user) => user.role === "admin");
      setTherapists(admins);
    } catch (error) {
      console.error("Failed to load therapists list:", error);
      toast.error("Failed to load therapist registry");
    } finally {
      setLoadingTherapists(false);
    }
  };

  // Fetch active clinic cases linked to a selected patient
  const fetchCasesForPatient = async (patientId) => {
    if (!patientId) {
      setPatientCases([]);
      return;
    }

    try {
      setLoadingCases(true);
      const res = await api.get(`/clinic/cases?patient=${patientId}`);
      setPatientCases(res.data || []);
    } catch (error) {
      console.error("Failed to load patient cases:", error);
      toast.error("Failed to load patient cases");
    } finally {
      setLoadingCases(false);
    }
  };

  return {
    therapists,
    loadingTherapists,
    fetchTherapists,
    patientCases,
    loadingCases,
    fetchCasesForPatient,
    setPatientCases,
  };
};

export default useClinicAppointments;
