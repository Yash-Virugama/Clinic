import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import ClinicSkeleton from "../components/ClinicSkeleton";
import Pagination from "../../../components/ui/Pagination";
import useClinicPagination from "../hooks/useClinicPagination";
import toast from "react-hot-toast";
import { useClinic } from "../../../context/ClinicContext";
import { useBranding } from "../../../context/BrandingContext";
import AppointmentCard from "../components/AppointmentCard";
import AppointmentFormModal from "../components/AppointmentFormModal";
import CustomConfirmModal from "../../../components/ui/CustomConfirmModal";
import useClinicAppointments from "../hooks/useClinicAppointments";
import {
  generateClinicPatientId,
  formatDateInputValue,
  mapZodErrors,
} from "../utils/clinicFormatters";
import { appointmentCreateSchema } from "../../../validations/appointmentSchema";

const ClinicTodayAppointments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const clinicPrefix = user?.role === "admin" ? "/clinic" : `/staff/${user?.role}/clinic`;
  const { settings } = useBranding();
  const { patients, updateAppointment, deleteAppointment } = useClinic();
  const { therapists, fetchTherapists, patientCases, fetchCasesForPatient, setPatientCases } = useClinicAppointments();

  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Form states for reschedule modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [therapistId, setTherapistId] = useState("");
  const [apptDate, setApptDate] = useState("");
  const [apptTime, setApptTime] = useState("");
  const [apptDuration, setApptDuration] = useState(30);
  const [apptLocation, setApptLocation] = useState("clinic");
  const [caseId, setCaseId] = useState("");
  const [apptNotes, setApptNotes] = useState("");
  const [apptStatus, setApptStatus] = useState("scheduled");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Confirm delete modal states
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
  });

  const fetchTodayAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/clinic/appointments");
      const allAppointments = res.data || [];
      const todayStr = new Date().toDateString();
      const filtered = allAppointments.filter((app) => {
        if (!app.date) return false;
        return new Date(app.date).toDateString() === todayStr;
      });
      filtered.sort((a, b) => (a.time || "").localeCompare(b.time || ""));
      setAppointments(filtered);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load today's appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayAppointments();
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const getPatientCode = (pId) => generateClinicPatientId(pId, settings?.name);

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
    const payload = {
      patient: patientId,
      therapist: therapistId,
      date: apptDate,
      time: apptTime,
      duration: Number(apptDuration),
      location: apptLocation,
      clinicCase: caseId || "null",
      notes: apptNotes,
      status: apptStatus,
    };

    const result = appointmentCreateSchema.safeParse(payload);
    if (!result.success) {
      setErrors(mapZodErrors(result.error.issues));
      return;
    }

    try {
      setSubmitting(true);
      await updateAppointment(selectedAppointment._id, {
        ...payload,
        clinicCase: caseId || "",
        notes: apptNotes.trim(),
      });
      setIsEditModalOpen(false);
      await fetchTodayAppointments();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reschedule appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const appt = appointments.find((a) => a._id === id);
      if (!appt) return;

      await updateAppointment(id, {
        patient: appt.patient?._id,
        therapist: appt.therapist?._id,
        date: formatDateInputValue(appt.date),
        time: appt.time,
        duration: appt.duration,
        location: appt.location,
        clinicCase: appt.clinicCase?._id || "",
        notes: appt.notes,
        status,
      });
      await fetchTodayAppointments();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

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
      await fetchTodayAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const openPatientDetails = (pId) => {
    if (pId) navigate(`${clinicPrefix}/patients/${pId}`);
  };

  const filteredAppointments = appointments.filter((app) => {
    const q = searchQuery.toLowerCase();
    const patientName = app.patient?.name || "";
    const therapistName = app.therapist?.name || "";
    const notes = app.notes || "";
    return (
      patientName.toLowerCase().includes(q) ||
      therapistName.toLowerCase().includes(q) ||
      notes.toLowerCase().includes(q)
    );
  });

  const {
    currentPage,
    pageItems: paginatedAppointments,
    totalPages,
    handlePageChange,
  } = useClinicPagination(filteredAppointments, 15, searchQuery);

  if (loading) {
    return <ClinicSkeleton type="details" />;
  }

  return (
    <div className="space-y-6 text-left animate-page-entrance">
      {/* Header and Back Button */}
      <div className="flex items-center gap-3 w-full sm:w-auto py-1">
        <Link
          to={clinicPrefix}
          className="group flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-full text-slate-650 hover:text-primary hover:border-primary shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 shrink-0"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>

        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none text-slate-400 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl ps-9 pe-14 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary text-[10px] font-bold uppercase tracking-wider font-accent cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Appointments List - Cards Layout */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-[32px] p-16 shadow-sm text-center">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <h3 className="text-base font-bold text-secondary mb-1">No Appointments Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto text-center">
            {searchQuery ? "No appointments match your search query." : "There are no therapy session bookings registered for today's date yet."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {paginatedAppointments.map((appointment) => (
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

      {/* Edit Form Modal */}
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
        clearError={(field) => setErrors((prev) => ({ ...prev, [field]: "" }))}
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

export default ClinicTodayAppointments;
