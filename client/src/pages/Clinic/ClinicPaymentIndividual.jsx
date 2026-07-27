import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import ClinicSkeleton from "../../components/ClinicSkeleton/ClinicSkeleton";
import { useBranding } from "../../context/BrandingContext";
import { formatDateDDMMYYYY } from "../../features/clinic/utils/clinicFormatters";
import ModalShell from "../../features/clinic/components/ModalShell";
import CustomSelect from "../../components/CustomSelect/CustomSelect";

const getCaseStatusClass = (status) => {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "Resolved":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "Cancelled":
      return "bg-amber-50 text-amber-600 border-amber-200";
    case "Closed":
      return "bg-rose-50 text-rose-600 border-rose-200";
    default:
      return "bg-slate-50 text-slate-650 border-slate-200";
  }
};

const ClinicPaymentIndividual = () => {
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
    return ((settings?.name?.slice(0, 3).toUpperCase() || "PT") + "-" + id.slice(-4).toUpperCase());
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

  if (loading) {
    return <ClinicSkeleton type="details" />;
  }

  if (!patient) {
    return (
      <div className="bg-white border border-slate-200/60 p-12 rounded-[32px] text-center max-w-xl mx-auto shadow-sm">
        <h3 className="text-base font-bold text-secondary mb-1">Patient Not Found</h3>
        <p className="text-xs text-slate-500 mb-4">The patient billing record you are searching for does not exist.</p>
        <Link to="/clinic/payments" className="px-5 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl">
          Back to Payments
        </Link>
      </div>
    );
  }

  // Calculate patient overall metrics
  const totalPaidAll = visits.reduce((acc, v) => v.paymentStatus === "Paid" ? acc + (v.paymentAmount || 0) : acc, 0);
  const totalUnpaidAll = visits.reduce((acc, v) => v.paymentStatus !== "Paid" ? acc + (v.paymentAmount || 0) : acc, 0);
  const isActive = cases.some((c) => c.status === "Active");

  return (
    <div className="space-y-8 relative text-left">
      {/* Top Navigation Back Action */}
      <div className="flex justify-between items-center">
        <Link
          to="/clinic/payments"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-650 hover:text-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Payments
        </Link>
      </div>

      {/* Patient Profile Billing Card */}
      <div className="bg-white border border-slate-200/60 px-5 py-6 sm:p-6 rounded-[28px] shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <Link
          to={`/clinic/patients/${id}`}
          className="flex items-center w-full gap-4 sm:gap-4.5 group cursor-pointer"
        >
          <div className="w-15 h-15 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold shrink-0 transition-colors group-hover:bg-primary/20">
            {getInitials(patient.name)}
          </div>
          <div className="w-full sm:w-auto">
            <div className="flex flex-wrap items-center justify-between sm:justify-start sm:gap-2">
              <h1 className="text-lg sm:text-xl font-heading font-bold text-secondary leading-none transition-colors group-hover:text-primary">
                {patient.name}
              </h1>
              <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded border font-accent ${isActive
                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : "bg-amber-50 text-amber-600 border-amber-200"
                }`}>
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4">
              <span>Code: <strong className="font-mono  text-slate-650">{getPatientCode()}</strong></span>
              <span>Phone: <strong className="text-slate-650 ">{patient.phone}</strong></span>
            </p>
          </div>
        </Link>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-4 shrink-0 w-full md:w-auto">
          <div className="flex-1 md:flex-initial bg-emerald-50/20 border border-emerald-100 rounded-2xl px-3 py-4 sm:p-4 text-center min-w-[120px]">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-500/80 font-accent block">
              Total Paid
            </span>
            <span className="text-base font-black text-emerald-600 block mt-1">
              ₹{totalPaidAll.toFixed(2)}
            </span>
          </div>

          <div className="flex-1 md:flex-initial bg-rose-50/20 border border-rose-100 rounded-2xl px-3 py-4 sm:p-4 text-center min-w-[120px]">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-rose-500/80 font-accent block">
              Total Unpaid
            </span>
            <span className="text-base font-black text-rose-600 block mt-1">
              ₹{totalUnpaidAll.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Cases Breakdown Section */}
      <div className="space-y-6">
        <div className="mt-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-semidarkblue">Patients Cases</h2>
        </div>

        {cases.length === 0 ? (
          <div className="bg-white border border-slate-200/60 p-12 rounded-[28px] text-center max-w-lg mx-auto shadow-sm">
            <p className="text-xs text-slate-500">This patient has no registered case folders or billing sessions.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {cases.map((c) => {
              const caseVisits = visits.filter((v) => v.clinicCase?._id === c._id);
              const casePaid = caseVisits.reduce((acc, v) => v.paymentStatus === "Paid" ? acc + (v.paymentAmount || 0) : acc, 0);
              const caseUnpaid = caseVisits.reduce((acc, v) => v.paymentStatus !== "Paid" ? acc + (v.paymentAmount || 0) : acc, 0);
              const isExpanded = !!expandedCaseIds[c._id];

              return (
                <div key={c._id} id={`case-card-${c._id}`} className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden transition-all duration-200">
                  {/* Case Title Header */}
                  <div
                    onClick={() => toggleCaseExpand(c._id)}
                    className="flex justify-between items-center px-6 py-4.5 bg-slate-50/50 hover:bg-slate-50 border-b border-slate-100 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-primary shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-19.5 0A2.25 2.25 0 004.5 15h15a2.25 2.25 0 002.25-2.25m-19.5 0v.25A2.25 2.25 0 004.5 17.5h15a2.25 2.25 0 002.25-2.25v-.25" />
                      </svg>
                      <div>
                        <h3 className="text-sm font-bold text-slate-700">{c.title}</h3>
                        <span className={`inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded border mt-1 ${getCaseStatusClass(c.status)}`}>
                          {c.status}
                        </span>
                      </div>
                    </div>

                    <svg
                      className={`w-5 h-5 text-slate-400 transform transition-transform duration-250 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>

                  {/* Case Content Accordion */}
                  <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="p-4 sm:p-6 space-y-6 border-t border-slate-100">
                        {/* Case Billing Summary Header Row */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50/50 p-4.5 rounded-2xl border border-slate-150/40">
                          <div className="flex items-center justify-center sm:justify-start gap-4">
                            <div className="text-left">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-600 font-accent block">
                                Case Paid
                              </span>
                              <span className="text-sm font-bold text-emerald-600 mt-0.5 block">
                                ₹{casePaid.toFixed(2)}
                              </span>
                            </div>
                            <div className="w-px h-8 bg-slate-200" />
                            <div className="text-left">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-rose-600 font-accent block">
                                Case Unpaid
                              </span>
                              <span className="text-sm font-bold text-rose-600 mt-0.5 block">
                                ₹{caseUnpaid.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => triggerEditCasePayments(c, caseVisits)}
                            className="px-4.5 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-primary-hover shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            Settle Case
                          </button>
                        </div>

                        {/* Sessions List */}
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-450 text-left">
                          Logged Sessions & Visits ({caseVisits.length})
                        </h4>

                        <div className="space-y-3 max-h-[276px] overflow-y-auto">
                          {caseVisits.length === 0 ? (
                            <p className="text-xs text-slate-400 italic text-left pl-2">No visits registered under this case file yet.</p>
                          ) : (
                            <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
                              {caseVisits.map((visit, index) => (
                                <div key={visit._id} className="flex justify-between items-center p-2.5 sm:p-4 hover:bg-slate-50/40 transition-colors">
                                  <div className="text-left space-y-1">
                                    <span className="text-[10px] bg-slate-100 text-slate-650 px-1.5 py-0.5 rounded font-mono font-bold">
                                      #{caseVisits.length - index}
                                    </span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs font-bold text-slate-700">
                                        {formatDateDDMMYYYY(visit.visitDate)}
                                      </span>
                                      <span className="text-slate-300">•</span>
                                      <span className="text-xs text-slate-500 font-medium">
                                        {visit.visitTime} ({visit.duration}m)
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-semibold">
                                      Therapist: {visit.therapist?.name || "—"}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2 sm:gap-4">
                                    <div className="text-right">
                                      <span className="text-xs font-black text-slate-700 block">
                                        ₹{(visit.paymentAmount || 0).toFixed(2)}
                                      </span>
                                      <span className={`inline-block px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded border mt-1 font-accent ${visit.paymentStatus === "Paid"
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                        : "bg-rose-50 text-rose-600 border-rose-100"
                                        }`}>
                                        {visit.paymentStatus || "Unpaid"}
                                      </span>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => triggerEditVisitPayment(visit)}
                                      className="ps-1 py-1 sm:p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                                      title="Edit payment"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Case Bulk Settle Payment Modal */}
      <ModalShell
        isOpen={isCaseModalOpen && !!selectedCaseData}
        onClose={() => {
          setIsCaseModalOpen(false);
          setSelectedCaseData(null);
        }}
        title="Edit Case Payment Totals"
      >
        {selectedCaseData && (
          <form onSubmit={handleCaseBulkSubmit} className="space-y-5">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Case Folder</span>
              <span className="text-xs font-bold text-slate-700 mt-1 block">{selectedCaseData.title}</span>
            </div>

            {/* Settle Action / Status */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">
                Bulk Payment Status
              </label>
              <CustomSelect
                value={caseBulkStatus}
                onChange={(val) => setCaseBulkStatus(val || "No Change")}
                options={[
                  { value: "No Change", label: "Keep Existing Statuses" },
                  { value: "Paid", label: "Mark All Sessions as Paid" },
                  { value: "Unpaid", label: "Mark All Sessions as Unpaid" },
                ]}
              />
            </div>

            {/* Set Bulk Rate / Fee */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">
                Set Flat Fee For All Sessions (₹)
              </label>
              <input
                type="number"
                placeholder="Leave blank to keep existing rates"
                value={caseBulkAmount}
                onChange={(e) => setCaseBulkAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/85 rounded-2xl px-4 py-3 text-xs text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCaseModalOpen(false);
                  setSelectedCaseData(null);
                }}
                className="flex-1 py-3 border border-slate-200 text-slate-650 bg-bg-offwhite hover:bg-slate-100 text-xs font-bold uppercase tracking-wider rounded-2xl transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={caseSubmitting}
                className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer text-center disabled:opacity-60"
              >
                {caseSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </ModalShell>

      {/* Single Visit Payment Modal */}
      <ModalShell
        isOpen={isVisitModalOpen && !!selectedVisitData}
        onClose={() => {
          setIsVisitModalOpen(false);
          setSelectedVisitData(null);
        }}
        title="Edit Session Payment"
      >
        {selectedVisitData && (
          <form onSubmit={handleVisitSubmit} className="space-y-5">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Session Date</span>
              <span className="text-xs font-bold text-slate-700 mt-1 block">{formatDateDDMMYYYY(selectedVisitData.visitDate)}</span>
            </div>

            {/* Visit Payment Status */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">
                Payment Status
              </label>
              <CustomSelect
                value={visitStatus}
                onChange={(val) => setVisitStatus(val || "Unpaid")}
                options={[
                  { value: "Paid", label: "Paid" },
                  { value: "Unpaid", label: "Unpaid" },
                ]}
              />
            </div>

            {/* Visit Fee Amount */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">
                Payment Amount (₹)
              </label>
              <input
                type="number"
                required
                value={visitAmount}
                onChange={(e) => setVisitAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/85 rounded-2xl px-4 py-3 text-xs text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsVisitModalOpen(false);
                  setSelectedVisitData(null);
                }}
                className="flex-1 py-3 border border-slate-200 text-slate-650 bg-bg-offwhite hover:bg-slate-100 text-xs font-bold uppercase tracking-wider rounded-2xl transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={visitSubmitting}
                className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer text-center disabled:opacity-60"
              >
                {visitSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </ModalShell>
    </div>
  );
};

export default ClinicPaymentIndividual;
