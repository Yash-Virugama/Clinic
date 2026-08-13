import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { useBranding } from "../../../context/BrandingContext";
import { generateClinicPatientId } from "../utils/clinicFormatters";

export const useClinicPaymentWorkspace = () => {
  const { id } = useParams();
  const location = useLocation();
  const { settings } = useBranding();

  const [patient, setPatient] = useState(null);
  const [cases, setCases] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Accordion toggle states per case ID
  const [expandedCaseIds, setExpandedCaseIds] = useState({});

  // Modals state
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [selectedCaseData, setSelectedCaseData] = useState(null);
  const [caseBulkStatus, setCaseBulkStatus] = useState("No Change");
  const [caseBulkAmount, setCaseBulkAmount] = useState("");
  const [caseSubmitting, setCaseSubmitting] = useState(false);

  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [selectedVisitData, setSelectedVisitData] = useState(null);
  const [visitStatus, setVisitStatus] = useState("Unpaid");
  const [visitAmount, setVisitAmount] = useState("");
  const [visitSubmitting, setVisitSubmitting] = useState(false);
  const [activeVisitMenuId, setActiveVisitMenuId] = useState(null);

  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      const patientRes = await api.get(`/clinic/patients/${id}`);
      setPatient(patientRes.data);

      const casesRes = await api.get(`/clinic/cases?patient=${id}`);
      const sortedCases = (casesRes.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setCases(sortedCases);

      const visitsRes = await api.get("/clinic/visits");
      const filteredVisits = (visitsRes.data || []).filter(
        (v) => v.clinicCase?.patient === id || v.clinicCase?.patient?._id === id
      );
      setVisits(filteredVisits);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load patient billing profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const openCaseId = searchParams.get("openCase");
    if (openCaseId && !loading) {
      setExpandedCaseIds({ [openCaseId]: true });
      setTimeout(() => {
        const element = document.getElementById(`case-card-${openCaseId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 250);
    }
  }, [location.search, loading]);

  const toggleCaseExpand = (caseId) => {
    setExpandedCaseIds((prev) => ({
      ...prev,
      [caseId]: !prev[caseId],
    }));
  };

  const getPatientCode = () => {
    if (!patient) return "—";
    return generateClinicPatientId(id, settings?.name);
  };

  const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "—";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  // Open Bulk Case Edit Modal
  const triggerEditCasePayments = (caseObj, caseVisits) => {
    setSelectedCaseData({
      ...caseObj,
      visits: caseVisits,
    });
    setCaseBulkStatus("No Change");
    setCaseBulkAmount("");
    setIsCaseModalOpen(true);
  };

  // Submit Bulk Case Edit
  const handleCaseBulkSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCaseData) return;

    try {
      setCaseSubmitting(true);
      const payload = {};
      if (caseBulkStatus !== "No Change") {
        payload.paymentStatus = caseBulkStatus;
      }
      if (caseBulkAmount.trim() !== "") {
        const parsedAmt = parseFloat(caseBulkAmount);
        if (isNaN(parsedAmt) || parsedAmt < 0) {
          toast.error("Please enter a valid positive payment amount");
          setCaseSubmitting(false);
          return;
        }
        payload.paymentAmount = parsedAmt;
      }

      if (Object.keys(payload).length === 0) {
        toast.error("Please select a status or specify a payment amount to update.");
        setCaseSubmitting(false);
        return;
      }

      await api.put(`/clinic/cases/${selectedCaseData._id}/payments`, payload);
      toast.success("Case payment details updated successfully");
      setIsCaseModalOpen(false);
      setSelectedCaseData(null);
      await fetchWorkspace();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update case payments");
    } finally {
      setCaseSubmitting(false);
    }
  };

  // Open Single Visit Edit Modal
  const triggerEditVisitPayment = (visitObj) => {
    setSelectedVisitData(visitObj);
    setVisitStatus(visitObj.paymentStatus || "Unpaid");
    setVisitAmount(visitObj.paymentAmount !== undefined ? visitObj.paymentAmount.toString() : "0");
    setIsVisitModalOpen(true);
  };

  // Submit Single Visit Edit
  const handleVisitSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVisitData) return;

    const parsedAmt = parseFloat(visitAmount);
    if (isNaN(parsedAmt) || parsedAmt < 0) {
      toast.error("Please enter a valid positive payment amount");
      return;
    }

    try {
      setVisitSubmitting(true);
      await api.put(`/clinic/visits/${selectedVisitData._id}`, {
        paymentStatus: visitStatus,
        paymentAmount: parsedAmt,
      });
      toast.success("Visit payment updated successfully");
      setIsVisitModalOpen(false);
      setSelectedVisitData(null);
      await fetchWorkspace();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update visit payment");
    } finally {
      setVisitSubmitting(false);
    }
  };

  const updateVisitPaymentStatus = async (visit, newStatus) => {
    try {
      await api.put(`/clinic/visits/${visit._id}`, {
        paymentStatus: newStatus,
        paymentAmount: visit.paymentAmount || 0,
      });
      toast.success(`Visit marked as ${newStatus}`);
      await fetchWorkspace();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update visit status");
    }
  };

  return {
    id,
    patient,
    cases,
    visits,
    loading,
    expandedCaseIds,
    isCaseModalOpen,
    setIsCaseModalOpen,
    selectedCaseData,
    setSelectedCaseData,
    caseBulkStatus,
    setCaseBulkStatus,
    caseBulkAmount,
    setCaseBulkAmount,
    caseSubmitting,
    isVisitModalOpen,
    setIsVisitModalOpen,
    selectedVisitData,
    setSelectedVisitData,
    visitStatus,
    setVisitStatus,
    visitAmount,
    setVisitAmount,
    visitSubmitting,
    activeVisitMenuId,
    setActiveVisitMenuId,
    toggleCaseExpand,
    getPatientCode,
    getInitials,
    triggerEditCasePayments,
    handleCaseBulkSubmit,
    triggerEditVisitPayment,
    handleVisitSubmit,
    updateVisitPaymentStatus,
    fetchWorkspace
  };
};

export default useClinicPaymentWorkspace;
