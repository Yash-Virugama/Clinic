import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import ClinicSkeleton from "../components/ClinicSkeleton";
import { useBranding } from "../../../context/BrandingContext";
import { formatDateDDMMYYYY } from "../utils/clinicFormatters";
import ModalShell from "../../../components/ui/ModalShell";
import CustomSelect from "../../../components/ui/CustomSelect";
import useClinicPaymentWorkspace from "../hooks/useClinicPaymentWorkspace";
import { printInvoice } from "../utils/invoicePrinter";
import { normalizePhoneNumber, generateWhatsAppLink } from "../utils/whatsappUtils";

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
  const { user } = useAuth();
  const clinicPrefix = user?.role === "admin" ? "/clinic" : `/staff/${user?.role}/clinic`;
  const { settings } = useBranding();
  const hasPaymentManagePerm = user?.role === "admin" || (user?.permissions && user?.permissions.includes("payments:manage"));
  const workspace = useClinicPaymentWorkspace();

  const {
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
    caseBulkDiscountAmount,
    setCaseBulkDiscountAmount,
    caseBulkDiscountType,
    setCaseBulkDiscountType,
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
  } = workspace;

  const handleDownloadInvoiceDirect = (c) => {
    const caseVisits = visits.filter((v) => (v.clinicCase?._id || v.clinicCase) === c._id);
    printInvoice({
      patient,
      clinicCase: c,
      visits: caseVisits,
      settings,
      patientCode: getPatientCode(),
    });
  };

  const handleShareInvoiceDirect = (c) => {
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
    const caseTitle = c.title || "Physiotherapy Case";
    const invoiceLink = `${window.location.origin}/public/invoice/${c._id}`;

    const message = `Hello ${patient.name} \u{1F44B}

This is an invoice update from ${clinicName}.

Please find the link to view and print your invoice for ${caseTitle} below:

${invoiceLink}

Thank you!`;

    const waUrl = generateWhatsAppLink(rawPhone, message);
    window.open(waUrl, "_blank");
    toast.success("Opening WhatsApp to share invoice...");
  };

  if (loading) {
    return <ClinicSkeleton type="details" />;
  }

  if (!patient) {
    return (
      <div className="bg-white border border-slate-200/60 p-12 rounded-[32px] text-center max-w-xl mx-auto shadow-sm">
        <h3 className="text-base font-bold text-secondary mb-1">Patient Not Found</h3>
        <p className="text-xs text-slate-500 mb-4">The patient billing record you are searching for does not exist.</p>
        <Link to={`${clinicPrefix}/payments`} className="px-5 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl">
          Back to Payments
        </Link>
      </div>
    );
  }

  // Calculate patient overall metrics incorporating discounts
  const caseTotalsMap = {};
  cases.forEach((c) => {
    caseTotalsMap[c._id] = {
      discountAmount: c.discountAmount || 0,
      discountType: c.discountType || "",
      subtotal: 0,
      paid: 0,
    };
  });

  visits.forEach((v) => {
    const caseId = v.clinicCase?._id || v.clinicCase;
    if (caseId && caseTotalsMap[caseId]) {
      caseTotalsMap[caseId].subtotal += v.paymentAmount || 0;
      if (v.paymentStatus === "Paid") {
        caseTotalsMap[caseId].paid += v.paymentAmount || 0;
      }
    }
  });

  const orphanPaid = visits
    .filter((v) => {
      const caseId = v.clinicCase?._id || v.clinicCase;
      return !caseId || !caseTotalsMap[caseId];
    })
    .filter((v) => v.paymentStatus === "Paid")
    .reduce((sum, v) => sum + (v.paymentAmount || 0), 0);

  const orphanUnpaid = visits
    .filter((v) => {
      const caseId = v.clinicCase?._id || v.clinicCase;
      return !caseId || !caseTotalsMap[caseId];
    })
    .filter((v) => v.paymentStatus !== "Paid")
    .reduce((sum, v) => sum + (v.paymentAmount || 0), 0);

  const totalPaidAll = Object.values(caseTotalsMap).reduce((sum, cData) => sum + cData.paid, 0) + orphanPaid;
  const totalUnpaidAll = Object.values(caseTotalsMap).reduce((sum, cData) => {
    let calculatedDiscount = 0;
    if (cData.discountType === "percentage") {
      calculatedDiscount = (cData.subtotal * cData.discountAmount) / 100;
    } else if (cData.discountType === "rupee") {
      calculatedDiscount = cData.discountAmount;
    }
    calculatedDiscount = Math.min(calculatedDiscount, cData.subtotal);
    const caseGrandTotal = cData.subtotal - calculatedDiscount;
    const caseRemaining = Math.max(0, caseGrandTotal - cData.paid);
    return sum + caseRemaining;
  }, 0) + orphanUnpaid;

  const isActive = cases.some((c) => c.status === "Active");

  return (
    <div className="space-y-8 relative text-left animate-page-entrance">
      {/* Top Navigation Back Action */}
      <div className="flex justify-between items-center">
        <Link
          to={`${clinicPrefix}/payments`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-650 hover:border-primary hover:text-primary text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all"
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
          to={`${clinicPrefix}/patients/${id}`}
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
              <span>Code: <strong className="font-mono  text-slate-650 uppercase">{getPatientCode()}</strong></span>
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
              const caseVisits = visits.filter((v) => (v.clinicCase?._id || v.clinicCase) === c._id);
              const casePaid = caseVisits.reduce((acc, v) => v.paymentStatus === "Paid" ? acc + (v.paymentAmount || 0) : acc, 0);
              const rawCaseUnpaid = caseVisits.reduce((acc, v) => v.paymentStatus !== "Paid" ? acc + (v.paymentAmount || 0) : acc, 0);
              const caseSubtotal = casePaid + rawCaseUnpaid;

              // Discount calculation matching InvoiceTemplate
              const discountAmountVal = c.discountAmount || 0;
              const discountType = c.discountType || "";
              let calculatedDiscount = 0;
              if (discountType === "percentage") {
                calculatedDiscount = (caseSubtotal * discountAmountVal) / 100;
              } else if (discountType === "rupee") {
                calculatedDiscount = discountAmountVal;
              }
              calculatedDiscount = Math.min(calculatedDiscount, caseSubtotal);
              const caseTotal = caseSubtotal - calculatedDiscount;
              const caseRemaining = Math.max(0, caseTotal - casePaid);
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

                    <div className="flex items-center gap-1.5 sm:gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadInvoiceDirect(c);
                        }}
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer animate-fade-in"
                        title="Download Invoice"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareInvoiceDirect(c);
                        }}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer animate-fade-in"
                        title="Share Invoice via WhatsApp"
                      >
                        {/* WhatsApp icon */}
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.835-2.277c1.662.986 3.29 1.48 4.908 1.48 5.61 0 10.174-4.567 10.177-10.177.002-2.72-1.055-5.277-2.978-7.202-1.92-1.923-4.474-2.98-7.193-2.98-5.617 0-10.183 4.568-10.187 10.18-.001 1.716.46 3.39 1.332 4.887L1.134 22.86l4.758-1.248c1.33.727 2.298 1.057 3.821.111zm11.758-7.795c-.29-.145-1.72-.848-1.986-.944-.266-.096-.46-.145-.653.145-.193.29-.747.944-.916 1.137-.168.193-.337.217-.627.072-2.31-1.036-3.873-2.247-5.068-4.298-.266-.458.266-.426.762-1.417.085-.17.042-.317-.02-.462-.064-.145-.653-1.572-.895-2.152-.236-.569-.475-.49-.653-.5-.17-.008-.363-.01-.556-.01-.193 0-.507.072-.772.36-.266.29-1.014.992-1.014 2.417s1.037 2.802 1.182 2.995c.145.193 2.036 3.11 4.931 4.36.688.297 1.226.475 1.643.607.69.219 1.32.188 1.817.114.553-.082 1.72-.703 1.961-1.383.24-.68.24-1.263.168-1.383-.072-.12-.265-.192-.555-.337z" />
                        </svg>
                      </button>
                      <svg
                        className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 hover:text-primary transform transition-transform duration-250 ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Case Content Accordion */}
                  <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="p-4 sm:p-6 space-y-6 border-t border-slate-100">
                        {/* Case Billing Summary Header Row */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50/50 p-4.5 rounded-2xl border border-slate-150/40">
                          <div className="grid grid-cols-2 gap-4 w-full sm:w-auto sm:flex sm:flex-row sm:items-center sm:gap-6">
                            <div className="text-center">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-600 font-accent block">
                                Case Subtotal
                              </span>
                              <span className="text-sm font-bold text-indigo-600 mt-0.5 block">
                                ₹{caseSubtotal.toFixed(2)}
                              </span>
                            </div>
                            <div className="hidden sm:block w-px h-8 bg-slate-200" />

                            <div className="text-center">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-600 font-accent block">
                                Discount
                              </span>
                              <span className="text-sm font-bold text-amber-600 mt-0.5 block">
                                ₹{calculatedDiscount.toFixed(2)}
                              </span>
                            </div>
                            <div className="hidden sm:block w-px h-8 bg-slate-200" />

                            <div className="text-center">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-600 font-accent block">
                                Case Paid
                              </span>
                              <span className="text-sm font-bold text-emerald-600 mt-0.5 block">
                                ₹{casePaid.toFixed(2)}
                              </span>
                            </div>

                            <div className="hidden sm:block w-px h-8 bg-slate-200" />

                            <div className="text-center">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-rose-600 font-accent block">
                                Case Unpaid
                              </span>
                              <span className="text-sm font-bold text-rose-600 mt-0.5 block">
                               ₹{caseRemaining.toFixed(2)}
                              </span>
                            </div>

                            <div className="hidden sm:block w-px h-8 bg-slate-200" />

                            <div className="text-center col-span-2 sm:col-span-1">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-600 font-accent block">
                                Case Total
                              </span>
                              <span className="text-sm font-bold text-blue-600 mt-0.5 block">
                                ₹{caseTotal.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {hasPaymentManagePerm && (
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
                          )}
                        </div>

                        {/* Sessions List */}
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-450 text-left">
                          Logged Sessions & Visits ({caseVisits.length})
                        </h4>

                        <div className="space-y-3 max-h-[276px] overflow-y-auto">
                          {caseVisits.length === 0 ? (
                            <p className="text-xs text-slate-400 italic text-left pl-2">No visits registered under this case file yet.</p>
                          ) : (
                            <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white">
                              {caseVisits.map((visit, index) => (
                                <div key={visit._id} className="flex justify-between items-center p-2.5 sm:p-4 hover:bg-slate-50/40 transition-colors">
                                  <div className="text-left space-y-1">

                                    <div className="flex gap-2 items-center">
                                      <span className="text-[10px] bg-slate-100 text-semidarkblue px-1.5 py-0.5 rounded font-mono font-bold">
                                        #{caseVisits.length - index}
                                      </span>
                                      <span className="text-xs font-bold sm:hidden text-slate-700">
                                        {formatDateDDMMYYYY(visit.visitDate)}
                                      </span>
                                    </div>

                                    <div className="flex flex-col justify-center sm:flex-row sm:items-center gap-1 sm:gap-2 mt-2 sm:mt-2">
                                      <span className="text-xs hidden sm:inline font-bold text-slate-700">
                                        {formatDateDDMMYYYY(visit.visitDate)}
                                      </span>
                                      <div className="flex gap-2 items-center">
                                        <span className="text-slate-300">•</span>
                                        <span className="text-xs text-slate-500 font-medium">
                                          {visit.visitTime} ({visit.duration}m)
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex gap-1 sm:gap-2 items-center">
                                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                      </svg>
                                      <p className="text-[10px] sm:text-[12px] text-slate-400 font-semibold">
                                        {visit.therapist?.name || "—"}
                                      </p>
                                    </div>
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

                                    {hasPaymentManagePerm && (
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
                                    )}

                                    {/* Three Dot Dropdown Button */}
                                    {hasPaymentManagePerm && (
                                      <div className="relative">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveVisitMenuId(activeVisitMenuId === visit._id ? null : visit._id);
                                          }}
                                          className="w-4 h-4 text-slate-400 hover:text-primary flex items-center justify-center shrink-0 transition-all cursor-pointer"
                                          title="Change Status"
                                        >
                                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                          </svg>
                                        </button>
                                        {activeVisitMenuId === visit._id && (
                                          <>
                                            <div
                                              className="fixed inset-0 z-40 cursor-default"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveVisitMenuId(null);
                                              }}
                                            />
                                            <div
                                              onClick={(e) => e.stopPropagation()}
                                              className="absolute right-6 -top-7 sm:-top-5 sm:right-5 mt-1 w-28 bg-white border border-slate-200/80 backdrop-blur-md rounded-2xl shadow-xl z-50 py-1 animate-page-entrance slide-in-from-top-1 duration-200"
                                            >
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setActiveVisitMenuId(null);
                                                  updateVisitPaymentStatus(visit, "Paid");
                                                }}
                                                className="w-full px-4 py-2 text-xs font-bold font-accent text-emerald-600 hover:bg-emerald-50/40 flex items-center gap-2 transition-colors cursor-pointer text-left"
                                              >
                                                Paid
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setActiveVisitMenuId(null);
                                                  updateVisitPaymentStatus(visit, "Unpaid");
                                                }}
                                                className="w-full px-4 py-2 text-xs font-bold font-accent text-rose-600 hover:bg-rose-50/40 flex items-center gap-2 transition-colors cursor-pointer text-left"
                                              >
                                                Unpaid
                                              </button>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    )}
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

      {/* Case Bulk Payment Update Modal */}
      <ModalShell
        isOpen={isCaseModalOpen}
        onClose={() => {
          setIsCaseModalOpen(false);
          setSelectedCaseData(null);
        }}
        title="Settle Case Payments"
      >
        {selectedCaseData && (
          <form onSubmit={handleCaseBulkSubmit} className="space-y-4.5 text-left">
            <div>
              <h3 className="text-xs text-slate-400 uppercase tracking-widest font-extrabold mb-1">
                Case Folder
              </h3>
              <p className="text-sm font-bold text-secondary">
                {selectedCaseData.title}
              </p>
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                Updating payment status will apply the update to all {selectedCaseData.visits?.length || 0} visits linked to this case.
              </p>
            </div>

            {/* Bulk Status Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">
                Bulk Payment Status
              </label>
              <CustomSelect
                value={caseBulkStatus}
                onChange={(val) => setCaseBulkStatus(val || "No Change")}
                options={[
                  { value: "No Change", label: "Keep Existing Status" },
                  { value: "Paid", label: "Mark All Paid" },
                  { value: "Unpaid", label: "Mark All Unpaid" },
                ]}
              />
            </div>

            {/* Bulk Fee Amount */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider block">
                Bulk Session Fee (₹)
              </label>
              <input
                type="number"
                value={caseBulkAmount}
                onChange={(e) => setCaseBulkAmount(e.target.value)}
                placeholder="Leave blank to keep existing visit fees"
                className="w-full bg-slate-50 border border-slate-200/85 rounded-2xl px-4 py-3 text-xs text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
              />
            </div>

            {/* Discount Option */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">
                    Discount Amount
                  </label>
                  <input
                    type="number"
                    value={caseBulkDiscountAmount}
                    onChange={(e) => setCaseBulkDiscountAmount(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200/85 rounded-2xl px-4 py-3 text-xs text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">
                    Discount Type
                  </label>
                  <CustomSelect
                    value={caseBulkDiscountType}
                    onChange={(val) => setCaseBulkDiscountType(val || "rupee")}
                    options={[
                      { value: "rupee", label: "Rupee (₹)" },
                      { value: "percentage", label: "Percentage (%)" },
                    ]}
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium italic mt-1 leading-normal">
                * Note: The discount is applied to the overall case total subtotal, not per individual visit session.
              </p>
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
                {caseSubmitting ? "Settiing..." : "Update All Visits"}
              </button>
            </div>
          </form>
        )}
      </ModalShell>

      {/* Single Visit Payment Update Modal */}
      <ModalShell
        isOpen={isVisitModalOpen}
        onClose={() => {
          setIsVisitModalOpen(false);
          setSelectedVisitData(null);
        }}
        title="Update Visit Payment"
      >
        {selectedVisitData && (
          <form onSubmit={handleVisitSubmit} className="space-y-4.5 text-left">
            <div>
              <h3 className="text-xs text-slate-400 uppercase tracking-widest font-extrabold mb-1">
                Visit Session
              </h3>
              <p className="text-sm font-bold text-secondary">
                Session Date: {formatDateDDMMYYYY(selectedVisitData.visitDate)}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Therapist: {selectedVisitData.therapist?.name || "Unassigned"}
              </p>
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
