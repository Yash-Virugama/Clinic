import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import ClinicSkeleton from "../components/ClinicSkeleton";
import CustomSelect from "../../../components/ui/CustomSelect";
import ModalShell from "../../../components/ui/ModalShell";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { useBranding } from "../../../context/BrandingContext";
import { useClinic } from "../../../context/ClinicContext";
import Pagination from "../../../components/ui/Pagination";
import { generateClinicPatientId } from "../utils/clinicFormatters";
import useClinicPagination from "../hooks/useClinicPagination";
import { printInvoice } from "../utils/invoicePrinter";
import { normalizePhoneNumber, generateWhatsAppLink } from "../utils/whatsappUtils";

const PAYMENTS_PER_PAGE = 15;

const ClinicPayments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const clinicPrefix = user?.role === "admin" ? "/clinic" : `/staff/${user?.role}/clinic`;
  const { settings } = useBranding();
  const { patients, loadingPatients, fetchPatients } = useClinic();
  const [searchQuery, setSearchQuery] = useState("");
  const [billingFilter, setBillingFilter] = useState("all");

  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedPatientForDownload, setSelectedPatientForDownload] = useState(null);
  const [patientCases, setPatientCases] = useState([]);
  const [loadingCases, setLoadingCases] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState("");

  const handleDownloadClick = async (e, patient) => {
    e.stopPropagation();
    setSelectedPatientForDownload(patient);
    setDownloadModalOpen(true);
    setPatientCases([]);
    setSelectedCaseId("");
    setLoadingCases(true);
    try {
      const res = await api.get(`/clinic/cases?patient=${patient._id}`);
      const casesList = res.data || [];
      setPatientCases(casesList);
      if (casesList.length > 0) {
        setSelectedCaseId(casesList[0]._id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load patient cases");
    } finally {
      setLoadingCases(false);
    }
  };
  const handleDownloadInvoice = async (clinicCase, patient) => {
    const loadId = toast.loading("Fetching billing details...", { id: "invoice-loading" });
    try {
      const res = await api.get(`/clinic/visits?clinicCase=${clinicCase._id}`);
      const visits = res.data || [];
      toast.dismiss(loadId);

      printInvoice({
        patient,
        clinicCase,
        visits,
        settings,
        patientCode: getPatientCode(patient._id),
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate invoice");
    }
  };

  const handleShareInvoice = (clinicCase, patient) => {
    const rawPhone = patient.phone;
    if (!rawPhone) {
      toast.error("Patient does not have a phone number registered.");
      return;
    }

    const normalized = normalizePhoneNumber(rawPhone);
    if (normalized.length < 10) {
      toast.error("Patient phone number format is invalid.");
      return;
    }

    const clinicName = settings?.name || "PhysioCare";
    const caseTitle = clinicCase.title || "Physiotherapy Case";
    const invoiceLink = `${window.location.origin}/public/invoice/${clinicCase._id}`;

    const message = `Hello ${patient.name} \u{1F44B}

This is an invoice update from ${clinicName}.

Please find the link to view and print your invoice for ${caseTitle} below:

${invoiceLink}

Thank you!`;

    const waUrl = generateWhatsAppLink(rawPhone, message);
    window.open(waUrl, "_blank");
    toast.success("Opening WhatsApp to share invoice...");
  };

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getPatientCode = (patientId) => generateClinicPatientId(patientId, settings?.name);

  // Filter patients by name, phone or code AND billing status
  const filteredPatients = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return (patients || [])
      .filter((patient) => {
        const matchesQuery =
          patient.name.toLowerCase().includes(query) ||
          patient.phone.includes(query) ||
          getPatientCode(patient._id).toLowerCase().includes(query);

        let matchesBilling = true;
        if (billingFilter === "unpaid") {
          matchesBilling = (patient.totalUnpaid || 0) > 0;
        } else if (billingFilter === "paid") {
          matchesBilling = (patient.totalUnpaid || 0) === 0;
        }

        return matchesQuery && matchesBilling;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [patients, searchQuery, billingFilter, settings?.name]);

  const {
    currentPage,
    pageItems: displayedPatients,
    totalPages,
    handlePageChange,
  } = useClinicPagination(filteredPatients, PAYMENTS_PER_PAGE, searchQuery);

  const getInitials = (name = "") => {handleDownloadClick
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "—";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  return (
    <div className="space-y-8 relative text-left animate-page-entrance">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full sm:w-80 shrink-0">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search patient name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200/80 rounded-xl pl-10 pr-14 py-2.5 text-xs text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium transition-all shadow-sm"
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

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          <div className="w-full sm:w-44 shrink-0">
            <CustomSelect
              value={billingFilter}
              onChange={(value) => setBillingFilter(value)}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "unpaid", label: "Unpaid" },
                { value: "paid", label: "Fully Settled" },
              ]}
            />
          </div>
        </div>
      </div>

      {loadingPatients ? (
        <ClinicSkeleton type="grid" count={6} />
      ) : filteredPatients.length === 0 ? (
        <div className="bg-white border border-slate-200/60 p-12 rounded-[32px] text-center max-w-xl mx-auto shadow-sm">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 5h12M6 9h12M9 5v8c3 0 6-1 6-4s-3-4-6-4M9 13l8 8" />
          </svg>
          <h3 className="text-base font-bold text-secondary mb-1">No Payments Found</h3>
          <p className="text-xs text-slate-500">
            {searchQuery || billingFilter !== "all" ? "No patient billing records match your filter criteria." : "Register patients and log visits to start tracking payments."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPatients.map((patient) => {
              const code = getPatientCode(patient._id);
              return (
                <div
                  key={patient._id}
                  onClick={() => navigate(`${clinicPrefix}/payments/${patient._id}`)}
                  className="bg-white border hover:-translate-y-1 border-slate-200/60 p-5 rounded-3xl shadow-sm hover:shadow-md hover:border-primary/20 transition-premium cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Top Identity Row */}
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 uppercase text-slate-500 font-bold text-[9px] font-bold rounded border border-slate-200">
                        {code}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded border font-accent ${patient.isActive
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-amber-50 text-amber-500 border-amber-200"
                          }`}>
                          {patient.isActive ? "Active" : "Inactive"}
                        </span>
                        <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded border font-accent ${patient.gender === "Male"
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : patient.gender === "Female"
                            ? "bg-purple-50 text-purple-600 border-purple-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                          }`}>
                          {patient.gender}
                        </span>
                      </div>
                    </div>

                    {/* Patient Info Row */}
                    <div className="flex justify-between items-center gap-3.5">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                          {getInitials(patient.name)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-heading font-bold text-semidarkblue leading-snug truncate">
                            {patient.name}
                          </h3>
                          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{patient.phone}</p>
                        </div>
                      </div>

                      {/* Download Invoice Button */}
                      <button
                        type="button"
                        onClick={(e) => handleDownloadClick(e, patient)}
                        className="w-9 h-9 rounded-xl border border-slate-200 hover:border-primary/30 text-slate-500 hover:text-primary bg-slate-50/50 hover:bg-primary/5 flex items-center justify-center transition-all cursor-pointer shrink-0"
                        title="Download case invoice"
                      >
                        <svg className="w-4.5 h-4.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V3m0 0L7.5 7.5M12 3l4.5 4.5M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Payment Breakdown Cards */}
                  <div className="mt-5 grid grid-cols-2 gap-3.5">
                    {/* Paid Block */}
                    <div className="bg-emerald-50/20 border border-emerald-100 rounded-2xl p-3 text-center">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-500/80 font-accent block">
                        Total Paid
                      </span>
                      <span className="text-sm font-black text-emerald-600 block mt-1">
                        ₹{(patient.totalPaid || 0).toFixed(2)}
                      </span>
                    </div>

                    {/* Unpaid Block */}
                    <div className="bg-rose-50/20 border border-rose-100 rounded-2xl p-3 text-center">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-rose-500/80 font-accent block">
                        Total Unpaid
                      </span>
                      <span className="text-sm font-black text-rose-600 block mt-1">
                        ₹{(patient.totalUnpaid || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Case Invoice Selector Modal */}
      <ModalShell
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        title="Download Invoice"
      >
        <div className="space-y-5 text-left">
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-accent mb-1">Patient</h4>
            <p className="text-sm font-bold text-secondary">{selectedPatientForDownload?.name}</p>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1.5">
              Select Case
            </label>
            {loadingCases ? (
              <div className="py-4 text-center">
                <span className="text-xs text-slate-400 italic">Loading patient cases...</span>
              </div>
            ) : patientCases.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl text-center">
                <p className="text-xs text-slate-500 font-medium">No clinic cases found for this patient.</p>
              </div>
            ) : (
              <CustomSelect
                value={selectedCaseId}
                onChange={(val) => setSelectedCaseId(val)}
                options={patientCases.map((c) => ({
                  value: c._id,
                  label: `${c.title} (${c.status})`,
                }))}
              />
            )}
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              disabled={loadingCases || patientCases.length === 0 || !selectedCaseId}
              onClick={() => {
                const selectedCase = patientCases.find((c) => c._id === selectedCaseId);
                if (selectedCase) {
                  handleDownloadInvoice(selectedCase, selectedPatientForDownload);
                }
                setDownloadModalOpen(false);
              }}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm disabled:opacity-50 transition-premium cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4.5 h-4.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V3m0 0L7.5 7.5M12 3l4.5 4.5M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5" />
              </svg>
              <span>Download</span>
            </button>

            <button
              type="button"
              disabled={loadingCases || patientCases.length === 0 || !selectedCaseId}
              onClick={() => {
                const selectedCase = patientCases.find((c) => c._id === selectedCaseId);
                if (selectedCase && selectedPatientForDownload) {
                  handleShareInvoice(selectedCase, selectedPatientForDownload);
                }
                setDownloadModalOpen(false);
              }}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm disabled:opacity-50 transition-premium cursor-pointer flex items-center justify-center gap-2"
            >
              {/* WhatsApp icon */}
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.835-2.277c1.662.986 3.29 1.48 4.908 1.48 5.61 0 10.174-4.567 10.177-10.177.002-2.72-1.055-5.277-2.978-7.202-1.92-1.923-4.474-2.98-7.193-2.98-5.617 0-10.183 4.568-10.187 10.18-.001 1.716.46 3.39 1.332 4.887L1.134 22.86l4.758-1.248c1.33.727 2.298 1.057 3.821.111zm11.758-7.795c-.29-.145-1.72-.848-1.986-.944-.266-.096-.46-.145-.653.145-.193.29-.747.944-.916 1.137-.168.193-.337.217-.627.072-2.31-1.036-3.873-2.247-5.068-4.298-.266-.458.266-.426.762-1.417.085-.17.042-.317-.02-.462-.064-.145-.653-1.572-.895-2.152-.236-.569-.475-.49-.653-.5-.17-.008-.363-.01-.556-.01-.193 0-.507.072-.772.36-.266.29-1.014.992-1.014 2.417s1.037 2.802 1.182 2.995c.145.193 2.036 3.11 4.931 4.36.688.297 1.226.475 1.643.607.69.219 1.32.188 1.817.114.553-.082 1.72-.703 1.961-1.383.24-.68.24-1.263.168-1.383-.072-.12-.265-.192-.555-.337z" />
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </ModalShell>
    </div>
  );
};

export default ClinicPayments;
