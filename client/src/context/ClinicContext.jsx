import { createContext, useContext, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const ClinicContext = createContext(null);

export const ClinicProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  // Fetch Patients List
  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);
      const response = await api.get("/clinic/patients");
      setPatients(response.data);
    } catch (error) {
      console.error("Failed to fetch clinic patients:", error);
      // Suppress toast notifications for unauthorized loads before login redirects
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error("Failed to load patient records");
      }
    } finally {
      setLoadingPatients(false);
    }
  };

  // Add Patient Action
  const addPatient = async (patientData) => {
    try {
      const response = await api.post("/clinic/patients", patientData);
      toast.success(response.data.message || "Patient registered successfully");
      await fetchPatients();
      return response.data;
    } catch (error) {
      console.error("Failed to register patient:", error);
      const errorMsg = error.response?.data?.message || "Failed to register patient";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Update Patient Action
  const updatePatient = async (patientId, patientData) => {
    try {
      const response = await api.put(`/clinic/patients/${patientId}`, patientData);
      toast.success(response.data.message || "Patient details updated successfully");
      await fetchPatients();
      return response.data.patient;
    } catch (error) {
      console.error("Failed to update patient:", error);
      const errorMsg = error.response?.data?.message || "Failed to update patient";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Delete Patient Action
  const deletePatient = async (patientId) => {
    try {
      const response = await api.delete(`/clinic/patients/${patientId}`);
      toast.success(response.data.message || "Patient record deleted successfully");
      await fetchPatients();
      return response.data;
    } catch (error) {
      console.error("Failed to delete patient:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete patient record";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Fetch Appointments List
  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const response = await api.get("/clinic/appointments");
      setAppointments(response.data);
    } catch (error) {
      console.error("Failed to fetch clinic appointments:", error);
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error("Failed to load appointments");
      }
    } finally {
      setLoadingAppointments(false);
    }
  };

  // Add Appointment Action
  const addAppointment = async (appointmentData) => {
    try {
      const response = await api.post("/clinic/appointments", appointmentData);
      toast.success(response.data.message || "Appointment scheduled successfully");
      await fetchAppointments();
      return response.data;
    } catch (error) {
      console.error("Failed to schedule appointment:", error);
      const errorMsg = error.response?.data?.message || "Failed to schedule appointment";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Update Appointment Action
  const updateAppointment = async (id, appointmentData) => {
    try {
      const response = await api.put(`/clinic/appointments/${id}`, appointmentData);
      toast.success(response.data.message || "Appointment updated successfully");
      await fetchAppointments();
      return response.data;
    } catch (error) {
      console.error("Failed to update appointment:", error);
      const errorMsg = error.response?.data?.message || "Failed to update appointment";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Delete Appointment Action
  const deleteAppointment = async (id) => {
    try {
      const response = await api.delete(`/clinic/appointments/${id}`);
      toast.success(response.data.message || "Appointment cancelled successfully");
      await fetchAppointments();
      return response.data;
    } catch (error) {
      console.error("Failed to delete appointment:", error);
      const errorMsg = error.response?.data?.message || "Failed to cancel appointment";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  return (
    <ClinicContext.Provider
      value={{
        patients,
        loadingPatients,
        fetchPatients,
        addPatient,
        updatePatient,
        deletePatient,
        appointments,
        loadingAppointments,
        fetchAppointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error("useClinic must be used within a ClinicProvider");
  }
  return context;
};
