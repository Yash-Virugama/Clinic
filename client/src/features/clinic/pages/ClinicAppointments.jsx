import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import ClinicSkeleton from "../components/ClinicSkeleton";
import { useBranding } from "../../../context/BrandingContext";
import { useClinic } from "../../../context/ClinicContext";
import AppointmentCard from "../components/AppointmentCard";
import AppointmentFilters from "../components/AppointmentFilters";
import AppointmentFormModal from "../components/AppointmentFormModal";
import Pagination from "../../../components/ui/Pagination";
import PatientFormModal from "../components/PatientFormModal";
import useClinicPagination from "../hooks/useClinicPagination";
import usePatientForm from "../hooks/usePatientForm";
import toast from "react-hot-toast";
import CustomConfirmModal from "../../../components/ui/CustomConfirmModal";
import {
  formatDateInputValue,
  generateClinicPatientId,
  mapZodErrors,
} from "../utils/clinicFormatters";
import useClinicAppointments from "../hooks/useClinicAppointments";
import { appointmentCreateSchema } from "../../../validations/appointmentSchema";

const APPOINTMENTS_PER_PAGE = 15;

const ClinicAppointments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const clinicPrefix = user?.role === "admin" ? "/clinic" : `/staff/${user?.role}/clinic`;
  const { settings } = useBranding();
  const {
    patients,
    appointments,
    loadingAppointments,
    fetchAppointments,
    fetchPatients,
    addPatient,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  } = useClinic();

  const {
    therapists,
    fetchTherapists,
    patientCases,
    fetchCasesForPatient,
    setPatientCases,
  } = useClinicAppointments();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [therapistId, setTherapistId] = useState("");
  const [apptDate, setApptDate] = useState("");
  const [apptTime, setApptTime] = useState("");
  const [apptDuration, setApptDuration] = useState(30);
  const [apptLocation, setApptLocation] = useState("clinic");
  const [caseId, setCaseId] = useState("");
  const [apptNotes, setApptNotes] = useState("");
  const [apptStatus, setApptStatus] = useState("scheduled");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [confirmModalConfig, setConfirmModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
  });

  const triggerDeleteAppointment = (appId) => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Delete Appointment",
      message: "Are you sure you want to permanently delete this appointment booking? This action cannot be undone.",
      onConfirm: () => handleConfirmDeleteAppointment(appId),
    });
  };

  const handleConfirmDeleteAppointment = async (appId) => {
    try {
      setSubmitting(true);
      await deleteAppointment(appId);
      setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete appointment");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchTherapists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (patientId) {
      fetchCasesForPatient(patientId);
    } else {
      setPatientCases([]);
    }
    setCaseId("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const appointmentForm = {
    patientId,
    setPatientId,
    therapistId,
    setTherapistId,
    apptDate,
    setApptDate,
    apptTime,
    setApptTime,
    apptDuration,
    setApptDuration,
    apptLocation,
    setApptLocation,
    caseId,
    setCaseId,
    apptNotes,
    setApptNotes,
    apptStatus,
    setApptStatus,
  };

  const getPatientCode = useCallback(
    (patientIdValue) => generateClinicPatientId(patientIdValue, settings?.name),
    [settings?.name]
  );

  const resetForm = () => {
    setPatientId("");
    setTherapistId("");
    setApptDate("");
    setApptTime("");
    setApptDuration(30);
    setApptLocation("clinic");
    setCaseId("");
    setApptNotes("");
    setApptStatus("scheduled");
    setSelectedAppointment(null);
    setErrors({});
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const getPayload = () => ({
    patient: patientId,
    therapist: therapistId,
    date: apptDate,
    time: apptTime,
    duration: Number(apptDuration),
    location: apptLocation,
    clinicCase: caseId || "null",
    notes: apptNotes,
    status: apptStatus,
  });

  const validateForm = () => {
    const result = appointmentCreateSchema.safeParse(getPayload());
    if (!result.success) {
      setErrors(mapZodErrors(result.error.issues));
      return false;
    }

    setErrors({});
    return true;
  };

  const buildRequestBody = () => ({
    patient: patientId,
    therapist: therapistId,
    date: apptDate,
    time: apptTime,
    duration: Number(apptDuration),
    location: apptLocation,
    clinicCase: caseId || "",
    notes: apptNotes.trim(),
    status: apptStatus,
  });

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await addAppointment({ ...buildRequestBody(), status: "scheduled" });
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (appointment) => {
    setSelectedAppointment(appointment);
    setPatientId(appointment.patient?._id || "");
    setTherapistId(appointment.therapist?._id || "");
    setApptDate(formatDateInputValue(appointment.date));
    setApptTime(appointment.time || "");
    setApptDuration(appointment.duration || 30);
    setApptLocation(appointment.location || "clinic");
    setCaseId(appointment.clinicCase?._id || "");
    setApptNotes(appointment.notes || "");
    setApptStatus("scheduled");
    setErrors({});
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await updateAppointment(selectedAppointment._id, buildRequestBody());
      resetForm();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const appointment = appointments.find((item) => item._id === id);
      if (!appointment) return;

      await updateAppointment(id, {
        patient: appointment.patient?._id,
        therapist: appointment.therapist?._id,
        date: formatDateInputValue(appointment.date),
        time: appointment.time,
        duration: appointment.duration,
        location: appointment.location,
        clinicCase: appointment.clinicCase?._id || "",
        notes: appointment.notes,
        status,
      });
    } catch (error) {
      console.error("Failed to update status dynamically:", error);
    }
  };

  const quickPatientForm = usePatientForm({
    addPatient,
    onSuccess: (result) => {
      if (result?.patient) {
        setPatientId(result.patient._id);
      }
      setIsAddPatientOpen(false);
    },
  });

  const filteredAppointments = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return (appointments || [])
      .filter((appointment) => {
        const patientName = appointment.patient?.name?.toLowerCase() || "";
        const patientCode = appointment.patient?._id ? getPatientCode(appointment.patient._id).toLowerCase() : "";
        const appointmentDate = formatDateInputValue(appointment.date);
        const matchesSearch =
          patientName.includes(query) ||
          patientCode.includes(query);
        const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
        const matchesDate = !dateFilter || appointmentDate === dateFilter;

        return matchesSearch && matchesStatus && matchesDate;
      })
      .sort((a, b) => {
        const dateA = new Date(`${formatDateInputValue(a.date)}T${a.time || "00:00"}`);
        const dateB = new Date(`${formatDateInputValue(b.date)}T${b.time || "00:00"}`);
        return dateB - dateA;
      });
  }, [appointments, searchQuery, statusFilter, dateFilter, getPatientCode]);

  const {
    currentPage,
    pageItems: currentAppointments,
    totalPages,
    handlePageChange,
  } = useClinicPagination(
    filteredAppointments,
    APPOINTMENTS_PER_PAGE,
    `${searchQuery}|${statusFilter}|${dateFilter}`
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA") return;

      if (event.key === "ArrowLeft" && currentPage > 1) {
        handlePageChange(currentPage - 1);
      } else if (event.key === "ArrowRight" && currentPage < totalPages) {
        handlePageChange(currentPage + 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages, handlePageChange]);

  const openQuickPatientModal = () => {
    quickPatientForm.resetForm();
    setIsAddPatientOpen(true);
  };

  const openPatientDetails = (patientIdValue) => {
    if (!patientIdValue) return;
    navigate(`${clinicPrefix}/patients/${patientIdValue}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="space-y-8 relative text-left animate-page-entrance">
      <AppointmentFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onAdd={() => {
          resetForm();
          setIsAddModalOpen(true);
        }}
      />

      {loadingAppointments ? (
        <ClinicSkeleton type="grid" count={6} />
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white border border-slate-200/60 p-12 rounded-[32px] text-center max-w-xl mx-auto shadow-sm">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <h3 className="text-base font-bold text-secondary mb-1">No Appointments Found</h3>
          <p className="text-xs text-slate-500">
            {searchQuery || statusFilter !== "all" || dateFilter
              ? "No scheduled sessions match your filter criteria."
              : "Register and book a physical therapy session to get started."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {currentAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                patientCode={appointment.patient?._id ? getPatientCode(appointment.patient._id).toUpperCase() : ""}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
                onEdit={openEditModal}
                onOpenPatient={openPatientDetails}
                onUpdateStatus={handleUpdateStatus}
                onDelete={triggerDeleteAppointment}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <AppointmentFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Therapy Session"
        onSubmit={handleAddSubmit}
        patients={patients}
        therapists={therapists}
        patientCases={patientCases}
        form={appointmentForm}
        errors={errors}
        submitting={submitting}
        clearError={clearError}
        onQuickPatient={openQuickPatientModal}
      />

      <AppointmentFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modify Appointment Details"
        onSubmit={handleEditSubmit}
        isEdit={true}
        selectedAppointment={selectedAppointment}
        patients={patients}
        therapists={therapists}
        patientCases={patientCases}
        form={appointmentForm}
        errors={errors}
        submitting={submitting}
        clearError={clearError}
      />

      <PatientFormModal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
        title="Quick Register Patient"
        form={quickPatientForm}
      />

      {/* Delete Confirmation Modal */}
      <CustomConfirmModal
        isOpen={confirmModalConfig.isOpen}
        onClose={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModalConfig.onConfirm}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        isLoading={submitting}
      />
    </div>
  );
};

export default ClinicAppointments;
