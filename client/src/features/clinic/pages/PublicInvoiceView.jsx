import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { generateClinicPatientId } from "../utils/clinicFormatters";

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const PublicInvoiceView = () => {
  const { caseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        setLoading(true);
        // Direct public call bypassing auth interceptors
        const res = await axios.get(`/api/clinic/cases/public/invoice/${caseId}`);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching public invoice:", err);
        setError("Failed to load invoice details. The link may be invalid or expired.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoiceData();
  }, [caseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center animate-fade-in">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-slate-800 mb-2">Invoice Not Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  const { patient, clinicCase, visits, settings } = data;
  const chargesPerDay = visits.length > 0 ? visits[0].paymentAmount : 0;
  const patientCode = generateClinicPatientId(patient._id, settings?.name);

  // Date day calculations matching invoicePrinter.js
  const caseOpenedDate = clinicCase.createdAt ? new Date(clinicCase.createdAt) : new Date();
  const startDateStr = caseOpenedDate.toLocaleDateString("en-IN");

  const lastStatusChangedDate = clinicCase.updatedAt ? new Date(clinicCase.updatedAt) : new Date();
  const endDateStr = lastStatusChangedDate.toLocaleDateString("en-IN");

  const startDay = new Date(caseOpenedDate);
  const endDay = new Date(lastStatusChangedDate);
  startDay.setHours(0, 0, 0, 0);
  endDay.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(endDay - startDay);
  const daysCount = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const totalAmount = chargesPerDay * daysCount;

  const invoiceNo = patientCode;
  const currentDateStr = new Date().toLocaleDateString("en-IN");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100/50 py-10 px-4 flex flex-col items-center">
      {/* Top Action Bar (hidden during printing) */}
      <div className="w-full max-w-[650px] bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex justify-between items-center mb-6 print:hidden animate-fade-in">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-slate-650 font-accent uppercase tracking-wider">Patient Invoice View</span>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4.5 py-2 rounded-xl transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
        >
          <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.82l2.9-2.9m0 0l2.9 2.9m-2.9-2.9v6c0 1.1-.9 2-2 2h-1a2 2 0 01-2-2v-3.75" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12A7.5 7.5 0 111.5 12a7.5 7.5 0 0115 0z" />
          </svg>
          Print / Save PDF
        </button>
      </div>

      {/* Main Invoice Container */}
      <div className="invoice-container w-full max-w-[650px] border-2 border-black p-6 flex flex-col bg-white box-border text-black shadow-sm print:shadow-none print:border-2 print:border-black print:my-0 print:mx-auto">
        {/* Logos and Clinic Name Row */}
        <div className="flex justify-between items-center gap-4 mb-1">
          <div className="w-[20%] flex justify-start items-center">
            {settings.logo ? (
              <img src={settings.logo} alt="Logo" className="max-h-[70px] max-w-[120px] object-contain" />
            ) : (
              <div className="w-[70px] h-[70px] bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 text-2xl">
                {getInitials(settings.name)}
              </div>
            )}
          </div>
          <div className="w-[60%] flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-black tracking-wide uppercase font-serif m-0">{settings.name}</h1>
            <div className="flex items-center justify-center w-full mt-1.5">
              <div className="flex-grow h-[2px] bg-black"></div>
              <span className="px-2.5 text-xs font-bold uppercase tracking-wider shrink-0">Physiotherapy Clinic</span>
              <div className="flex-grow h-[2px] bg-black"></div>
            </div>
          </div>
          <div className="w-[20%] flex justify-end items-center">
            <img src="/caduceus.png" alt="Caduceus" className="max-h-[70px] max-w-[120px] object-contain" />
          </div>
        </div>

        <div className="w-full h-[1.5px] bg-black my-2.5"></div>

        {/* Address and Phone centered */}
        <div className="text-center text-[11px] font-bold leading-normal mb-1">
          <p className="m-0.5">{settings.address || "Address not available"}</p>
          <p className="m-0.5">☎ {settings.phone || "Phone not available"}</p>
        </div>

        <div className="w-full h-[1px] bg-black mt-1 mb-2.5"></div>

        {/* Meta details layout */}
        <div className="mt-3.5 text-xs font-bold leading-loose text-left">
          <div className="flex justify-between mb-2">
            <div className="flex w-[45%] items-baseline">
              <span className="shrink-0">No.</span>
              <div className="border-b border-black flex-grow ml-1.5 pl-1.5 font-normal">{invoiceNo}</div>
            </div>
            <div className="flex w-[45%] items-baseline">
              <span className="shrink-0">Date:</span>
              <div className="border-b border-black flex-grow ml-1.5 pl-1.5 font-normal">{currentDateStr}</div>
            </div>
          </div>
          <div className="flex w-full items-baseline mb-2">
            <span className="shrink-0">Name:</span>
            <div className="border-b border-black flex-grow ml-1.5 pl-1.5 font-normal">
              {patient.name} ({patient.phone || "—"})
            </div>
          </div>
        </div>

        {/* Main Invoice Table */}
        <table className="w-full border-collapse border border-black mt-4 table">
          <thead>
            <tr className="border-b border-black">
              <th className="w-[10%] border-r border-black p-1.5 text-xs font-bold uppercase text-center">Sr. No.</th>
              <th className="w-[90%] p-1.5 text-xs font-bold uppercase text-center">PHYSIOTHERAPY</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-black">
              <td className="w-[10%] border-r border-black p-2.5 text-center align-top font-bold">1</td>
              <td className="w-[90%] p-2.5 align-top text-left">
                <div className="flex flex-col justify-between min-h-[220px] h-full w-full">
                  <div className="text-sm font-bold mb-5">Case Name: {clinicCase.title}</div>
                  
                  <div className="text-xs font-bold leading-relaxed mt-auto pt-10">
                    <div>Date : {startDateStr} to {endDateStr}</div>
                    <div>Charges Per Day : ₹ {chargesPerDay.toFixed(2)}</div>
                    <div>Days : {daysCount}</div>
                  </div>
                </div>
              </td>
            </tr>
            <tr className="h-10">
              <td className="border-r border-black"></td>
              <td className="text-right font-bold text-xs p-2">
                Total &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ₹ {totalAmount.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Received Sign */}
        <div className="mt-20 flex justify-end text-xs font-bold pr-2.5">
          <div className="flex items-end gap-2">
            <span className="pb-1">Received Sign:</span>
            <div className="relative w-[160px] border-b border-black flex justify-center pb-0.5">
              {settings.receivedSign ? (
                <img
                  src={settings.receivedSign}
                  alt="Signature"
                  className="absolute bottom-0 h-[65px] max-w-[150px] object-contain pointer-events-none"
                />
              ) : (
                <div className="h-6"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicInvoiceView;
