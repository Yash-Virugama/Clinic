import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import ClinicSkeleton from "../../components/ClinicSkeleton/ClinicSkeleton";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import { useAuth } from "../../context/AuthContext";
import { useBranding } from "../../context/BrandingContext";
import { useClinic } from "../../context/ClinicContext";
import {
  formatDateDDMMYYYY,
  generateClinicPatientId,
} from "../../features/clinic/utils/clinicFormatters";

// Import modular child components
import PatientProfileCard from "../../features/clinic/components/PatientProfileCard";
import PatientFormModal from "../../features/clinic/components/PatientFormModal";
import CaseSummaryCard from "../../features/clinic/components/CaseSummaryCard";
import InternalNotesCard from "../../features/clinic/components/InternalNotesCard";
import AddNoteModal from "../../features/clinic/components/AddNoteModal";
import CustomConfirmModal from "../../components/CustomConfirmModal/CustomConfirmModal";
import CaseFormModal from "../../features/clinic/components/CaseFormModal";
import ClinicalRecordFormModal from "../../features/clinic/components/ClinicalRecordFormModal";
import ClinicalRecordCard from "../../features/clinic/components/ClinicalRecordCard";
import DocCard from "../../features/clinic/components/DocCard";
import DocFormModal from "../../features/clinic/components/DocFormModal";
import VisitFormModal from "../../features/clinic/components/VisitFormModal";

const tabs = [
  { key: "overview", label: "Overview", icon: "info" },
  { key: "cases", label: "Cases", icon: "folder" },
  { key: "clinical", label: "Clinical", icon: "clipboard" },
  { key: "docs", label: "Docs", icon: "file" },
  { key: "visits", label: "Visits", icon: "clock" },
];

const Icon = ({ name, className = "w-6 h-6" }) => {
  const common = { className, fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24" };

  if (name === "folder") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5A2.5 2.5 0 015.5 5h4l2 2h7A2.5 2.5 0 0121 9.5v7A2.5 2.5 0 0118.5 19h-13A2.5 2.5 0 013 16.5v-9z" /></svg>;
  }
  if (name === "clipboard") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6m-6 4h6m-6 4h3m-5-9h10a2 2 0 012 2v13H5V6a2 2 0 012-2zm2-2h6v4H9V2z" /></svg>;
  }
  if (name === "file") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5M9 15h6M9 18h4" /></svg>;
  }
  if (name === "clock") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  }
  if (name === "edit") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.651-1.65a1.875 1.875 0 112.652 2.651L9.75 16.904 6 18l1.096-3.75L18.512 2.837z" /></svg>;
  }
  if (name === "upload") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14" /></svg>;
  }
  if (name === "plus") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" /></svg>;
  }

  return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M12 17v-6m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
};

const EmptyState = ({ icon, title, subtitle }) => (
  <div className="min-h-[220px] flex flex-col items-center justify-center text-center px-4 py-8 bg-slate-50/30 rounded-2xl border border-slate-100">
    <Icon name={icon} className="w-11 h-11 text-slate-300 mb-4" />
    <h3 className="text-sm font-bold text-slate-500">{title}</h3>
    <p className="text-xs text-slate-400 mt-1 max-w-sm">{subtitle}</p>
  </div>
);

const StatusPill = ({ children, tone = "green" }) => {
  const tones = {
    green: "border-emerald-200 text-emerald-600 bg-emerald-50",
    blue: "border-blue-200 text-blue-600 bg-blue-50",
    amber: "border-amber-200 text-amber-600 bg-amber-50",
    rose: "border-rose-200 text-rose-600 bg-rose-50",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${tones[tone] || tones.slate}`}>
      {children}
    </span>
  );
};

const getStatusTone = (status) => {
  switch (status) {
    case "Active":
      return "green";
    case "Resolved":
      return "blue";
    case "Cancelled":
      return "amber";
    case "Closed":
      return "rose";
    default:
      return "slate";
  }
};

const CaseSelect = ({ cases, selectedCaseId, setSelectedCaseId, excludeGeneral = false }) => (
  <CustomSelect
    value={selectedCaseId}
    onChange={setSelectedCaseId}
    options={[
      ...(!excludeGeneral ? [{ value: "all", label: "General" }] : []),
      ...cases.map((clinicCase, index) => ({
        value: clinicCase._id,
        label: `Case ${index + 1} - ${clinicCase.title}`,
      }))
    ]}
    placeholder="Select Case"
  />
);

const ClinicPatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings } = useBranding();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [patient, setPatient] = useState(null);
  const [cases, setCases] = useState([]);
  const [records, setRecords] = useState([]);
  const [files, setFiles] = useState([]);
  const [visits, setVisits] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({ isOpen: false, title: "", message: "", onConfirm: null });
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isEditDoc, setIsEditDoc] = useState(false);
  const [selectedDocData, setSelectedDocData] = useState(null);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [isEditCase, setIsEditCase] = useState(false);
  const [selectedCaseData, setSelectedCaseData] = useState(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isEditRecord, setIsEditRecord] = useState(false);
  const [selectedRecordData, setSelectedRecordData] = useState(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isEditVisit, setIsEditVisit] = useState(false);
  const [selectedVisitData, setSelectedVisitData] = useState(null);
  const [expandedVisitId, setExpandedVisitId] = useState(null);
  const [expandedRecordId, setExpandedRecordId] = useState(null);
  const [expandedDocId, setExpandedDocId] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const currentUserId = user?._id || user?.id;

  const { updatePatient } = useClinic();
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
  const [editPatientName, setEditPatientName] = useState("");
  const [editPatientPhone, setEditPatientPhone] = useState("");
  const [editPatientGender, setEditPatientGender] = useState("Male");
  const [editPatientErrors, setEditPatientErrors] = useState({ name: "", phone: "" });
  const [editPatientSubmitting, setEditPatientSubmitting] = useState(false);

  const fetchPatientWorkspace = async () => {
    try {
      setLoading(true);
      const [patientRes, casesRes] = await Promise.all([
        api.get(`/clinic/patients/${id}`),
        api.get(`/clinic/cases?patient=${id}`),
      ]);

      const caseList = casesRes.data || [];
      setPatient(patientRes.data);
      setCases(caseList);
      const activeCase = caseList.find((c) => c.status === "Active");
      setSelectedCaseId((current) => {
        if (current && (current === "all" || caseList.some((c) => c._id === current))) return current;
        return activeCase?._id || caseList[0]?._id || "";
      });

      const caseIds = caseList.map((c) => c._id);
      const [recordGroups, fileGroups, visitGroups] = await Promise.all([
        Promise.all([...caseIds, "null"].map((cId) => api.get(`/clinic/records?clinicCase=${cId}&patient=${id}`))),
        Promise.all([...caseIds, "null"].map((cId) => api.get(`/clinic/files?clinicCase=${cId}&patient=${id}`))),
        Promise.all(caseIds.map((cId) => api.get(`/clinic/visits?clinicCase=${cId}&patient=${id}`))),
      ]);

      setRecords(recordGroups.flatMap((res) => res.data || []));
      setFiles(fileGroups.flatMap((res) => res.data || []));
      setVisits(visitGroups.flatMap((res) => res.data || []));
    } catch (error) {
      console.error("Error fetching patient workspace:", error);
      toast.error(error.response?.data?.message || "Failed to load patient details");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/notifications/users");
      const admins = (res.data.users || []).filter((u) => u.role === "admin");
      setDoctors(admins);
    } catch (err) {
      console.error("Failed to load doctor registry:", err);
    }
  };

  useEffect(() => {
    fetchPatientWorkspace();
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const triggerEditPatient = () => {
    if (!patient) return;
    setEditPatientName(patient.name || "");
    setEditPatientPhone(patient.phone || "");
    setEditPatientGender(patient.gender || "Male");
    setEditPatientErrors({ name: "", phone: "" });
    setIsEditPatientOpen(true);
  };

  const handleEditPatientNameChange = (val) => {
    setEditPatientName(val);
    if (val.trim()) {
      setEditPatientErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleEditPatientPhoneChange = (val) => {
    const digitsOnly = val.replace(/\D/g, "");
    setEditPatientPhone(digitsOnly);
    if (digitsOnly.length === 10) {
      setEditPatientErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleEditPatientSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    const newErrors = { name: "", phone: "" };

    if (!editPatientName.trim()) {
      newErrors.name = "Patient name is required";
      hasError = true;
    }

    if (editPatientPhone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
      hasError = true;
    }

    if (hasError) {
      setEditPatientErrors(newErrors);
      return;
    }

    try {
      setEditPatientSubmitting(true);
      await updatePatient(patient._id, {
        name: editPatientName.trim(),
        phone: editPatientPhone.trim(),
        gender: editPatientGender,
      });
      setIsEditPatientOpen(false);
      await fetchPatientWorkspace();
    } catch (error) {
      console.error(error);
    } finally {
      setEditPatientSubmitting(false);
    }
  };

  const editPatientForm = {
    values: {
      name: editPatientName,
      phone: editPatientPhone,
      gender: editPatientGender,
    },
    errors: editPatientErrors,
    submitting: editPatientSubmitting,
    handleNameChange: handleEditPatientNameChange,
    handlePhoneChange: handleEditPatientPhoneChange,
    setGender: setEditPatientGender,
    handleSubmit: handleEditPatientSubmit,
  };

  const selectedCase = cases.find((clinicCase) => clinicCase._id === selectedCaseId) || cases.find((c) => c.status === "Active") || cases[0];
  const overviewCase = cases.find((c) => c.status === "Active") || selectedCase || cases[0];
  const patientCode = generateClinicPatientId(patient?._id, settings?.name);

  const scopedRecords = useMemo(
    () => selectedCaseId === "all"
      ? records.filter((record) => !record.clinicCase)
      : records.filter((record) => record.clinicCase?._id === selectedCaseId),
    [records, selectedCaseId]
  );
  const scopedFiles = useMemo(
    () => selectedCaseId === "all"
      ? files.filter((file) => !file.clinicCase)
      : files.filter((file) => file.clinicCase?._id === selectedCaseId),
    [files, selectedCaseId]
  );
  const visitsCaseId = useMemo(() => {
    if (selectedCaseId === "all") {
      return cases.find((c) => c.status === "Active")?._id || cases[0]?._id || "";
    }
    return selectedCaseId;
  }, [selectedCaseId, cases]);

  const scopedVisits = useMemo(
    () => visits.filter((visit) => visit.clinicCase?._id === visitsCaseId),
    [visits, visitsCaseId]
  );

  const triggerCreateCase = () => {
    setIsEditCase(false);
    setSelectedCaseData(null);
    setIsCaseModalOpen(true);
  };

  const triggerEditCase = (clinicCase) => {
    setIsEditCase(true);
    setSelectedCaseData(clinicCase);
    setIsCaseModalOpen(true);
  };

  const handleCaseFormSubmit = async (formData) => {
    try {
      setSaving(true);
      if (isEditCase && selectedCaseData) {
        await api.put(`/clinic/cases/${selectedCaseData._id}`, {
          patient: id,
          title: formData.title,
          consultingDoctor: formData.consultingDoctor,
          status: formData.status,
        });
        toast.success("Case file updated successfully");
      } else {
        await api.post("/clinic/cases", {
          patient: id,
          title: formData.title,
          consultingDoctor: formData.consultingDoctor,
          status: formData.status,
        });
        toast.success("New case file opened successfully");
      }
      setIsCaseModalOpen(false);
      setSelectedCaseData(null);
      await fetchPatientWorkspace();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save case file");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCaseStatus = async (caseId, newStatus) => {
    try {
      setSaving(true);
      const caseObj = cases.find((c) => c._id === caseId);
      await api.put(`/clinic/cases/${caseId}`, {
        patient: id,
        title: caseObj?.title,
        consultingDoctor: caseObj?.consultingDoctor?._id || caseObj?.consultingDoctor,
        status: newStatus,
      });
      toast.success(`Case status updated to ${newStatus}`);
      await fetchPatientWorkspace();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update case status");
    } finally {
      setSaving(false);
    }
  };

  const triggerDeleteCase = (caseId) => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Delete Case File",
      message: "Are you sure you want to permanently delete this case folder? All linked visits, records, and files will lose their case folder association. This action cannot be undone.",
      onConfirm: () => handleConfirmDeleteCase(caseId),
    });
  };

  const handleConfirmDeleteCase = async (caseId) => {
    try {
      setSaving(true);
      await api.delete(`/clinic/cases/${caseId}`);
      toast.success("Case folder deleted successfully");
      setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      await fetchPatientWorkspace();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete case folder");
    } finally {
      setSaving(false);
    }
  };

  const triggerCreateRecord = () => {
    if (cases.length === 0) {
      toast.error("Open a case before adding a clinical record");
      return;
    }
    setIsEditRecord(false);
    setSelectedRecordData(null);
    setIsRecordModalOpen(true);
  };

  const triggerEditRecord = (record) => {
    setIsEditRecord(true);
    setSelectedRecordData(record);
    setIsRecordModalOpen(true);
  };

  const handleRecordFormSubmit = async (formData) => {
    try {
      setSaving(true);
      const targetCaseId = formData.clinicCase === "all" ? "" : formData.clinicCase;
      if (isEditRecord && selectedRecordData) {
        await api.put(`/clinic/records/${selectedRecordData._id}`, {
          chiefComplaint: formData.chiefComplaint,
          diagnosis: formData.diagnosis,
          treatmentPlan: formData.treatmentPlan,
          alertsAndPrecautions: formData.alertsAndPrecautions,
          clinicCase: targetCaseId,
          patient: id,
        });
        toast.success("Clinical record updated successfully");
      } else {
        await api.post("/clinic/records", {
          chiefComplaint: formData.chiefComplaint,
          diagnosis: formData.diagnosis,
          treatmentPlan: formData.treatmentPlan,
          alertsAndPrecautions: formData.alertsAndPrecautions,
          clinicCase: targetCaseId,
          patient: id,
        });
        toast.success("Clinical record created successfully");
      }
      setIsRecordModalOpen(false);
      setSelectedRecordData(null);
      await fetchPatientWorkspace();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save clinical record");
    } finally {
      setSaving(false);
    }
  };

  const triggerDeleteRecord = (recordId) => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Delete Clinical Record",
      message: "Are you sure you want to permanently delete this clinical record? This action cannot be undone.",
      onConfirm: () => handleConfirmDeleteRecord(recordId),
    });
  };

  const handleConfirmDeleteRecord = async (recordId) => {
    try {
      setSaving(true);
      await api.delete(`/clinic/records/${recordId}`);
      toast.success("Clinical record deleted successfully");
      setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      setIsRecordModalOpen(false);
      setSelectedRecordData(null);
      await fetchPatientWorkspace();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete clinical record");
    } finally {
      setSaving(false);
    }
  };

  const triggerDeleteVisit = (visitId) => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Delete Visit",
      message: "Are you sure you want to permanently delete this logged visit? This action cannot be undone.",
      onConfirm: () => handleConfirmDeleteVisit(visitId),
    });
  };

  const handleConfirmDeleteVisit = async (visitId) => {
    try {
      setSaving(true);
      await api.delete(`/clinic/visits/${visitId}`);
      toast.success("Visit deleted successfully");
      setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      await fetchPatientWorkspace();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete visit");
    } finally {
      setSaving(false);
    }
  };

  const logVisit = () => {
    if (cases.length === 0) {
      toast.error("Open a case before logging a visit");
      return;
    }
    setIsEditVisit(false);
    setSelectedVisitData(null);
    setIsVisitModalOpen(true);
  };

  const editVisit = (visit) => {
    setIsEditVisit(true);
    setSelectedVisitData(visit);
    setIsVisitModalOpen(true);
  };

  const handleVisitFormSubmit = async (formData) => {
    try {
      setSaving(true);
      if (isEditVisit && selectedVisitData) {
        await api.put(`/clinic/visits/${selectedVisitData._id}`, formData);
        toast.success("Visit updated successfully");
      } else {
        await api.post("/clinic/visits", formData);
        toast.success("Visit logged successfully");
      }
      setIsVisitModalOpen(false);
      setSelectedVisitData(null);
      await fetchPatientWorkspace();
      setActiveTab("visits");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save visit");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateVisitStatus = async (visitId, newStatus) => {
    try {
      setSaving(true);
      await api.put(`/clinic/visits/${visitId}`, { status: newStatus });
      toast.success(`Visit status updated to ${newStatus}`);
      await fetchPatientWorkspace();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const triggerUploadDoc = () => {
    if (cases.length === 0) {
      toast.error("Open a case before uploading a document");
      return;
    }
    setIsEditDoc(false);
    setSelectedDocData(null);
    setIsDocModalOpen(true);
  };

  const triggerEditDoc = (file) => {
    setIsEditDoc(true);
    setSelectedDocData(file);
    setIsDocModalOpen(true);
  };

  const triggerDeleteDoc = (fileId) => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Delete Document",
      message: "Are you sure you want to permanently delete this document? This action cannot be undone.",
      onConfirm: () => handleConfirmDeleteDoc(fileId),
    });
  };

  const handleConfirmDeleteDoc = async (fileId) => {
    try {
      setSaving(true);
      await api.delete(`/clinic/files/${fileId}`);
      toast.success("Document deleted successfully");
      setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      setIsDocModalOpen(false);
      setSelectedDocData(null);
      await fetchPatientWorkspace();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete document");
    } finally {
      setSaving(false);
    }
  };

  const handleDocFormSubmit = async (formData) => {
    try {
      setSaving(true);
      const targetCaseId = formData.clinicCase === "all" ? "" : formData.clinicCase;
      if (isEditDoc && selectedDocData) {
        if (formData.file) {
          const fd = new FormData();
          fd.append("file", formData.file);
          fd.append("fileName", formData.fileName);
          fd.append("fileType", formData.fileType);
          fd.append("clinicCase", targetCaseId);
          fd.append("notes", formData.notes);
          fd.append("patient", id);
          await api.put(`/clinic/files/${selectedDocData._id}`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await api.put(`/clinic/files/${selectedDocData._id}`, {
            fileName: formData.fileName,
            fileType: formData.fileType,
            clinicCase: targetCaseId,
            notes: formData.notes,
            patient: id,
          });
        }
        toast.success("Document updated successfully");
      } else {
        const fd = new FormData();
        fd.append("file", formData.file);
        fd.append("fileName", formData.fileName);
        fd.append("fileType", formData.fileType);
        fd.append("clinicCase", targetCaseId);
        fd.append("notes", formData.notes);
        fd.append("patient", id);
        await api.post("/clinic/files", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Document uploaded successfully");
      }
      setIsDocModalOpen(false);
      setSelectedDocData(null);
      await fetchPatientWorkspace();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save document");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateNoteSubmit = async ({ noteType, note }) => {
    try {
      setSaving(true);
      await api.post(`/clinic/patients/${id}/notes`, {
        noteType,
        note,
      });
      toast.success("Note added successfully");
      setIsAddNoteOpen(false);
      await fetchPatientWorkspace();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add note");
    } finally {
      setSaving(false);
    }
  };

  const deleteInternalNote = (noteId) => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Delete Internal Note",
      message: "Are you sure you want to permanently delete this internal note? This action cannot be undone.",
      onConfirm: () => handleConfirmDeleteNote(noteId),
    });
  };

  const handleConfirmDeleteNote = async (noteId) => {
    try {
      setSaving(true);
      await api.delete(`/clinic/patients/${id}/notes/${noteId}`);
      toast.success("Note deleted successfully");
      setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      await fetchPatientWorkspace();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete note");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ClinicSkeleton type="details" />;

  if (!patient) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-secondary mb-2">Patient Not Found</h3>
        <p className="text-sm text-slate-500 mb-6">The patient record you are looking for does not exist or has been deleted.</p>
        <Link to="/clinic/patients" className="px-6 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-primary-hover shadow inline-block">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-page-entrance">
      {/* Top Header bar */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-semidarkblue">Patient Profile</h1>
        <Link to="/clinic/patients" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-650 text-xs font-bold uppercase tracking-wider shadow-sm hover:border-primary hover:text-primary transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      {/* Two-Column Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Left Column: Basic Details Card */}
        <div className="lg:col-span-1">
          <PatientProfileCard
            patient={patient}
            patientCode={patientCode}
            settings={settings}
            selectedCase={selectedCase}
            onEdit={triggerEditPatient}
            isActive={cases.some((c) => c.status === "Active")}
          />
        </div>

        {/* Right Column: Tab System and Details */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-slate-200/50 rounded-[28px] shadow-sm">
            {/* Tab navigation */}
            <div className="grid grid-cols-5 border-b px-2 border-slate-150 overflow-x-auto bg-slate-50/30 rounded-t-[28px]">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`min-w-[50px] flex flex-col items-center justify-center gap-1 py-3 border-b-2.5 transition-colors cursor-pointer ${isActive ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-secondary"
                      }`}
                  >
                    <Icon name={tab.icon} className="w-5 h-5" />
                    <span className="text-[11px] font-bold tracking-wide">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab contents */}
            <div className="px-3.5 py-6 sm:p-7">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Active Case Card */}
                  {overviewCase ? (
                    <CaseSummaryCard
                      selectedCase={overviewCase}
                      caseIndex={cases.findIndex((item) => item._id === overviewCase._id) + 1}
                      visitsCount={visits.filter((v) => v.clinicCase?._id === overviewCase._id).length}
                      recordsCount={records.filter((r) => r.clinicCase?._id === overviewCase._id).length}
                      filesCount={files.filter((f) => f.clinicCase?._id === overviewCase._id).length}
                      onNavigateToTabs={() => setActiveTab("cases")}
                      formatDate={formatDateDDMMYYYY}
                    />
                  ) : (
                    <EmptyState icon="folder" title="No active case yet." subtitle='Click "Open New Case" to create the first one.' />
                  )}

                  {/* Internal Notes Card */}
                  <InternalNotesCard
                    notes={patient.notes || []}
                    onAddClick={() => setIsAddNoteOpen(true)}
                    onDelete={deleteInternalNote}
                    saving={saving}
                    formatDate={formatDateDDMMYYYY}
                  />
                </div>
              )}

              {activeTab === "cases" && (
                <div className="space-y-5">
                  <button onClick={triggerCreateCase} disabled={saving} className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-primary-hover disabled:opacity-60 cursor-pointer">
                    <Icon name="plus" className="w-4.5 h-4.5" />
                    Open New Case
                  </button>
                  {cases.length === 0 ? (
                    <EmptyState icon="folder" title="No cases opened yet." subtitle='Click "Open New Case" to create the first case.' />
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {cases.map((clinicCase, index) => (
                        <CaseListCard
                          key={clinicCase._id}
                          clinicCase={clinicCase}
                          index={index + 1}
                          visits={visits.filter((visit) => visit.clinicCase?._id === clinicCase._id)}
                          records={records.filter((record) => record.clinicCase?._id === clinicCase._id)}
                          files={files.filter((file) => file.clinicCase?._id === clinicCase._id)}
                          onEdit={triggerEditCase}
                          onUpdateStatus={(newStatus) => handleUpdateCaseStatus(clinicCase._id, newStatus)}
                          onDelete={() => triggerDeleteCase(clinicCase._id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "clinical" && (
                <div className="space-y-5">
                  <SectionToolbar
                    cases={cases}
                    selectedCaseId={selectedCaseId}
                    setSelectedCaseId={setSelectedCaseId}
                    buttonLabel="Add Record"
                    buttonIcon="plus"
                    onAction={triggerCreateRecord}
                    disabled={cases.length === 0 || saving}
                  />
                  {scopedRecords.length === 0 ? (
                    <EmptyState icon="clipboard" title="No clinical records yet." subtitle='Click "Add Record" to create the first one.' />
                  ) : (
                    <div className="space-y-3">
                      {scopedRecords.map((record, index) => (
                        <ClinicalRecordCard
                          key={record._id}
                          record={record}
                          index={index + 1}
                          expanded={expandedRecordId === record._id}
                          onToggleExpand={() =>
                            setExpandedRecordId((curr) => (curr === record._id ? null : record._id))
                          }
                          onEdit={triggerEditRecord}
                          onDelete={triggerDeleteRecord}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "docs" && (
                <div className="space-y-5">
                  <SectionToolbar
                    cases={cases}
                    selectedCaseId={selectedCaseId}
                    setSelectedCaseId={setSelectedCaseId}
                    buttonLabel="Upload"
                    buttonIcon="upload"
                    onAction={triggerUploadDoc}
                    disabled={cases.length === 0 || saving}
                  />
                  {scopedFiles.length === 0 ? (
                    <EmptyState icon="folder" title="No documents uploaded yet." subtitle='Click "Upload" to add the first one.' />
                  ) : (
                    <div className="space-y-3">
                      {scopedFiles.map((file, index) => (
                        <DocCard
                          key={file._id}
                          file={file}
                          index={index + 1}
                          expanded={expandedDocId === file._id}
                          onToggleExpand={() =>
                            setExpandedDocId((curr) => (curr === file._id ? null : file._id))
                          }
                          onEdit={triggerEditDoc}
                          onDelete={triggerDeleteDoc}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "visits" && (
                <div className="space-y-5">
                  <SectionToolbar
                    cases={cases}
                    selectedCaseId={visitsCaseId}
                    setSelectedCaseId={setSelectedCaseId}
                    buttonLabel="Log Visit"
                    buttonIcon="plus"
                    onAction={logVisit}
                    disabled={!visitsCaseId || saving}
                    excludeGeneral={true}
                  />
                  {scopedVisits.length === 0 ? (
                    <EmptyState icon="clock" title="No visits logged yet." subtitle='Click "Log Visit" to add the first visit.' />
                  ) : (
                    <div className="space-y-3">
                      {scopedVisits.map((visit, index) => (
                        <VisitCard
                          key={visit._id}
                          visit={visit}
                          index={index + 1}
                          cases={cases}
                          expanded={expandedVisitId === visit._id}
                          onToggleExpand={() =>
                            setExpandedVisitId((curr) => (curr === visit._id ? null : visit._id))
                          }
                          onEdit={() => editVisit(visit)}
                          onUpdateStatus={(newStatus) => handleUpdateVisitStatus(visit._id, newStatus)}
                          onDelete={() => triggerDeleteVisit(visit._id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={isAddNoteOpen}
        onClose={() => setIsAddNoteOpen(false)}
        onSubmit={handleCreateNoteSubmit}
        submitting={saving}
      />

      {/* Delete Confirmation Modal */}
      <CustomConfirmModal
        isOpen={confirmModalConfig.isOpen}
        onClose={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModalConfig.onConfirm}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        isLoading={saving}
      />

      {/* Case Creation/Edit Form Modal */}
      <CaseFormModal
        isOpen={isCaseModalOpen}
        onClose={() => {
          setIsCaseModalOpen(false);
          setSelectedCaseData(null);
        }}
        onSubmit={handleCaseFormSubmit}
        isEdit={isEditCase}
        caseData={selectedCaseData}
        doctors={doctors}
        submitting={saving}
      />

      {/* Clinical Record Creation/Edit Form Modal */}
      <ClinicalRecordFormModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setSelectedRecordData(null);
        }}
        onSubmit={handleRecordFormSubmit}
        onDelete={selectedRecordData ? () => triggerDeleteRecord(selectedRecordData._id) : null}
        isEdit={isEditRecord}
        recordData={selectedRecordData}
        cases={cases}
        selectedCaseId={selectedCaseId}
        submitting={saving}
      />

      {/* Document Upload/Edit Form Modal */}
      <DocFormModal
        isOpen={isDocModalOpen}
        onClose={() => {
          setIsDocModalOpen(false);
          setSelectedDocData(null);
        }}
        onSubmit={handleDocFormSubmit}
        isEdit={isEditDoc}
        fileData={selectedDocData}
        cases={cases}
        selectedCaseId={selectedCaseId}
        submitting={saving}
      />

      {/* Visit Creation/Edit Form Modal */}
      <VisitFormModal
        isOpen={isVisitModalOpen}
        onClose={() => {
          setIsVisitModalOpen(false);
          setSelectedVisitData(null);
        }}
        onSubmit={handleVisitFormSubmit}
        isEdit={isEditVisit}
        visitData={selectedVisitData}
        cases={cases}
        selectedCaseId={selectedCaseId}
        doctors={doctors}
        submitting={saving}
      />

      {/* Patient Edit Form Modal */}
      <PatientFormModal
        isOpen={isEditPatientOpen}
        onClose={() => setIsEditPatientOpen(false)}
        title="Edit Patient Details"
        form={editPatientForm}
        submitLabel="Save Changes"
        submittingLabel="Saving..."
      />
    </div>
  );
};

const SectionToolbar = ({ cases, selectedCaseId, setSelectedCaseId, buttonLabel, buttonIcon, onAction, disabled, excludeGeneral = false }) => (
  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 sm:gap-4 items-center">
    <CaseSelect cases={cases} selectedCaseId={selectedCaseId} setSelectedCaseId={setSelectedCaseId} excludeGeneral={excludeGeneral} />
    <button
      onClick={onAction}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-primary-hover disabled:opacity-60 cursor-pointer shrink-0"
    >
      <Icon name={buttonIcon} className="w-4 h-4" />
      {buttonLabel}
    </button>
  </div>
);

const CaseListCard = ({ clinicCase, index, visits, records, files, onEdit, onUpdateStatus, onDelete }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowStatusMenu(false);
      }
    };
    if (showStatusMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusMenu]);

  // bhai
  return (
    <div className="border border-slate-150 rounded-2xl p-4.5 bg-bg-offwhite shadow-sm flex flex-col justify-between hover:border-primary/20 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0">
            {index}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-secondary truncate">{clinicCase.title}</h3>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <StatusPill tone={getStatusTone(clinicCase.status)}>{clinicCase.status}</StatusPill>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onEdit(clinicCase)}
            className="w-8 h-8 rounded-xl border border-slate-200 hover:border-primary/40 text-slate-400 hover:text-primary flex items-center justify-center shrink-0 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <svg className="w-3.5 h-3.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>

          {/* Three dots dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="w-4 h-4 text-slate-400 hover:text-primary flex items-center justify-center shrink-0 transition-all cursor-pointer"
              title="Change Status"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
            {showStatusMenu && (
              <div className="absolute right-6 -top-12 sm:-top-5 sm:right-5 mt-1.5 w-36 bg-white border border-slate-200/80 backdrop-blur-md rounded-2xl shadow-xl py-1.5 z-50 animate-page-entrance slide-in-from-top-1 duration-200">
                {/* Active */}
                <button
                  onClick={() => {
                    setShowStatusMenu(false);
                    if (clinicCase.status !== "Active") onUpdateStatus("Active");
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-emerald-600 hover:bg-emerald-50/40 transition-colors"
                >
                  Active
                </button>

                {/* Resolved */}
                <button
                  onClick={() => {
                    setShowStatusMenu(false);
                    if (clinicCase.status !== "Resolved") onUpdateStatus("Resolved");
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-blue-600 hover:bg-blue-50/40 transition-colors"
                >
                  Resolved
                </button>

                {/* Closed */}
                <button
                  onClick={() => {
                    setShowStatusMenu(false);
                    if (clinicCase.status !== "Cancelled") onUpdateStatus("Cancelled");
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-amber-600 hover:bg-amber-50/40 transition-colors"
                >
                  Cancelled
                </button>

                {/* Cancelled */}
                <button
                  onClick={() => {
                    setShowStatusMenu(false);
                    if (clinicCase.status !== "Closed") onUpdateStatus("Closed");
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-rose-600 hover:bg-rose-50/40 transition-colors"
                >
                  Closed
                </button>

                {/* Divider */}
                <div className="border-t border-slate-200 my-0.5"></div>

                {/* Delete */}
                <button
                  onClick={() => {
                    setShowStatusMenu(false);
                    onDelete();
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-amber-600 hover:bg-amber-50/40 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-accent">
        <span>Opened: {formatDateDDMMYYYY(clinicCase.createdAt)}</span>
        <span>{visits.length} sessions</span>
        <span className="text-emerald-600 font-bold">{records.length + files.length} records</span>
      </div>
    </div>
  );
};

const SimpleRecordCard = ({ index, title, subtitle, date, icon = "clipboard", onClick }) => (
  <div
    onClick={onClick}
    className={`border border-slate-150 rounded-2xl p-4 flex items-center gap-4 bg-white shadow-sm hover:border-primary/20 transition-all ${onClick ? "cursor-pointer hover:shadow-sm" : ""
      }`}
  >
    <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center text-sm font-bold shrink-0">
      {index}
    </div>
    <div className="min-w-0 flex-1">
      <h3 className="text-sm font-bold text-secondary truncate">{title}</h3>
      <div className="flex flex-wrap items-center gap-2 mt-1.5">
        <StatusPill tone="blue">{subtitle}</StatusPill>
        <span className="text-[10px] text-slate-400 font-semibold font-accent">{formatDateDDMMYYYY(date)}</span>
      </div>
    </div>
    <Icon name={icon} className="w-4.5 h-4.5 text-slate-400 shrink-0" />
  </div>
);

const VisitCard = ({ visit, index, cases, expanded, onToggleExpand, onEdit, onUpdateStatus, onDelete }) => {
  const caseIndex = cases.findIndex((c) => c._id === (visit.clinicCase?._id || visit.clinicCase)) + 1;
  const caseTitle = visit.clinicCase?.title || "General";
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowStatusMenu(false);
      }
    };
    if (showStatusMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusMenu]);

  // Status coloring
  const statusColors = visit.status === "Completed"
    ? "border-emerald-500/30 text-emerald-600 bg-emerald-50/20"
    : visit.status === "Cancelled"
      ? "border-rose-500/30 text-rose-600 bg-rose-50/20"
      : "border-indigo-500/30 text-indigo-600 bg-indigo-50/20"; // Scheduled

  return (
    <div className="bg-bg-offwhite border border-slate-150 hover:border-slate-200/80 rounded-2xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.01)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300">
      {/* Header section (Clickable to toggle expand) */}
      <div className="flex items-center justify-between gap-3 cursor-pointer" onClick={onToggleExpand}>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-black border border-primary/20 font-accent">
            {index}
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-700 leading-none mb-1.5">
              {formatDateDDMMYYYY(visit.visitDate)}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 py-0.5 rounded-md border text-[9px] font-extrabold uppercase tracking-wider font-accent ${statusColors}`}>
                {visit.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Chevron */}
          <div className="text-slate-400 hover:text-slate-600 transition-colors p-1">
            {expanded ? (
              <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            ) : (
              <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            )}
          </div>

          {/* Edit button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent expanding when clicking edit
              onEdit();
            }}
            className="w-8 h-8 rounded-xl border border-slate-200 hover:border-primary/40 text-slate-400 hover:text-primary flex items-center justify-center shrink-0 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <svg className="w-3.5 h-3.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>

          {/* Direct status update (Three dots dropdown) */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowStatusMenu(!showStatusMenu);
              }}
              className="w-4 h-4 text-slate-400 hover:text-primary flex items-center justify-center shrink-0 transition-all cursor-pointer"
              title="Change Status"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
            {showStatusMenu && (
              <div className="absolute right-6 -top-12 sm:-top-5 sm:right-5 mt-1.5 w-36 bg-white border border-slate-200/80 backdrop-blur-md rounded-2xl shadow-xl py-1.5 z-50 animate-page-entrance slide-in-from-top-1 duration-200">
                {/* Scheduled */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusMenu(false);
                    if (visit.status !== "Scheduled") onUpdateStatus("Scheduled");
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-indigo-600 hover:bg-indigo-50/40 transition-colors"
                >
                  Scheduled
                </button>

                {/* Completed */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusMenu(false);
                    if (visit.status !== "Completed") onUpdateStatus("Completed");
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-emerald-600 hover:bg-emerald-50/40 transition-colors"
                >
                  Completed
                </button>

                {/* Cancelled */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusMenu(false);
                    if (visit.status !== "Cancelled") onUpdateStatus("Cancelled");
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-rose-600 hover:bg-rose-50/40 transition-colors"
                >
                  Cancelled
                </button>

                {/* Divider */}
                <div className="border-t border-slate-200 my-0.5"></div>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusMenu(false);
                    onDelete();
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-amber-600 hover:bg-amber-50/40 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded details Accordion */}
      <div className={`grid transition-[grid-template-rows,margin-top] duration-300 ease-in-out ${expanded ? "grid-rows-[1fr] mt-3.5" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="border-t border-slate-200/80 pt-3.5 space-y-2.5">
            {/* Therapist row */}
            <div className="flex items-center gap-2.5 text-slate-500 text-xs font-semibold">
              <svg className="w-4 h-4 text-slate-400 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span>{visit.therapist?.name || "Unassigned"}</span>
            </div>

            {/* Location row */}
            <div className="flex items-center gap-2.5 text-slate-500 text-xs font-semibold">
              <svg className="w-4 h-4 text-slate-400 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12v18H3V3z" />
              </svg>
              <span className="capitalize">{visit.location}</span>
            </div>

            {/* Payment row */}
            <div className="flex items-center gap-2.5 text-slate-500 text-xs font-semibold">
              <svg className="w-4 h-4 text-slate-400 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-19.5 5.25h19.5m-19.5 0h19.5M4.5 18h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v9A2.25 2.25 0 004.5 18z" />
              </svg>
              <span className="text-emerald-600 font-bold">₹{visit.paymentAmount?.toFixed(2)}</span>
              <span className={`px-1.5 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-wider font-accent leading-none ${visit.paymentStatus === "Paid"
                ? "border-emerald-500/25 text-emerald-600 bg-emerald-50/20"
                : "border-rose-500/25 text-rose-600 bg-rose-50/20"
                }`}>
                {visit.paymentStatus}
              </span>
            </div>

            {/* Case folder link row */}
            {caseIndex > 0 && (
              <div className="flex items-center gap-2.5 text-slate-500 text-xs font-semibold">
                <svg className="w-4 h-4 text-slate-400 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.625-1.875a3.375 3.375 0 00-3.375 3.375M9 21h12m-12 0v-1.5m0 1.5H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                <span className="text-slate-400">{caseIndex} — <span className="text-slate-600 font-bold">{caseTitle}</span></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicPatientDetails;
