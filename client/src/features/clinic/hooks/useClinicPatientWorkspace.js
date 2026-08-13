import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import { useBranding } from "../../../context/BrandingContext";
import { useClinic } from "../../../context/ClinicContext";
import { generateClinicPatientId } from "../utils/clinicFormatters";

export const useClinicPatientWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings } = useBranding();
  const { user } = useAuth();
  const { updatePatient } = useClinic();

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
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null
  });
  
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

  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
  const [editPatientName, setEditPatientName] = useState("");
  const [editPatientPhone, setEditPatientPhone] = useState("");
  const [editPatientGender, setEditPatientGender] = useState("Male");
  const [editPatientAge, setEditPatientAge] = useState("");
  const [editPatientErrors, setEditPatientErrors] = useState({ name: "", phone: "", age: "" });
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
      const allowedRoles = ["admin", "intern", "physiotherapist"];
      const admins = (res.data.users || []).filter((u) => allowedRoles.includes(u.role));
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

  const triggerEditPatient = () => {
    if (!patient) return;
    setEditPatientName(patient.name || "");
    setEditPatientPhone(patient.phone || "");
    setEditPatientGender(patient.gender || "Male");
    setEditPatientAge(patient.age !== undefined ? patient.age.toString() : "");
    setEditPatientErrors({ name: "", phone: "", age: "" });
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

  const handleEditPatientAgeChange = (val) => {
    setEditPatientAge(val);
    if (val) {
      setEditPatientErrors((prev) => ({ ...prev, age: "" }));
    }
  };

  const handleEditPatientSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    const newErrors = { name: "", phone: "", age: "" };

    if (!editPatientName.trim()) {
      newErrors.name = "Patient name is required";
      hasError = true;
    }

    if (editPatientPhone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
      hasError = true;
    }

    const parsedAge = parseInt(editPatientAge, 10);
    if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 120) {
      newErrors.age = "Age must be a number between 0 and 120";
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
        age: parsedAge,
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
      age: editPatientAge,
    },
    errors: editPatientErrors,
    submitting: editPatientSubmitting,
    handleNameChange: handleEditPatientNameChange,
    handlePhoneChange: handleEditPatientPhoneChange,
    handleAgeChange: handleEditPatientAgeChange,
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
          treatment: formData.treatment,
        });
        toast.success("Case file updated successfully");
      } else {
        await api.post("/clinic/cases", {
          patient: id,
          title: formData.title,
          consultingDoctor: formData.consultingDoctor,
          status: formData.status,
          treatment: formData.treatment,
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
        treatment: caseObj?.treatment,
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

  return {
    id,
    activeTab,
    setActiveTab,
    patient,
    cases,
    records,
    files,
    visits,
    selectedCaseId,
    setSelectedCaseId,
    loading,
    saving,
    isAddNoteOpen,
    setIsAddNoteOpen,
    confirmModalConfig,
    setConfirmModalConfig,
    isDocModalOpen,
    setIsDocModalOpen,
    isEditDoc,
    setIsEditDoc,
    selectedDocData,
    setSelectedDocData,
    isCaseModalOpen,
    setIsCaseModalOpen,
    isEditCase,
    setIsEditCase,
    selectedCaseData,
    setSelectedCaseData,
    isRecordModalOpen,
    setIsRecordModalOpen,
    isEditRecord,
    setIsEditRecord,
    selectedRecordData,
    setSelectedRecordData,
    isVisitModalOpen,
    setIsVisitModalOpen,
    isEditVisit,
    setIsEditVisit,
    selectedVisitData,
    setSelectedVisitData,
    expandedVisitId,
    setExpandedVisitId,
    expandedRecordId,
    setExpandedRecordId,
    expandedDocId,
    setExpandedDocId,
    doctors,
    isEditPatientOpen,
    setIsEditPatientOpen,
    editPatientForm,
    selectedCase,
    overviewCase,
    patientCode,
    scopedRecords,
    scopedFiles,
    visitsCaseId,
    scopedVisits,
    fetchPatientWorkspace,
    triggerEditPatient,
    triggerCreateCase,
    triggerEditCase,
    handleCaseFormSubmit,
    handleUpdateCaseStatus,
    triggerDeleteCase,
    triggerCreateRecord,
    triggerEditRecord,
    handleRecordFormSubmit,
    triggerDeleteRecord,
    triggerDeleteVisit,
    logVisit,
    editVisit,
    handleVisitFormSubmit,
    handleUpdateVisitStatus,
    triggerUploadDoc,
    triggerEditDoc,
    triggerDeleteDoc,
    handleDocFormSubmit,
    handleCreateNoteSubmit,
    deleteInternalNote
  };
};

export default useClinicPatientWorkspace;
