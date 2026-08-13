import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { generateClinicPatientId } from "../utils/clinicFormatters";


const PublicInvoiceView = () => {
  const { caseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        setLoading(true);
        // Direct public call bypassing auth interceptors, targeting the backend server
        const apiBase = import.meta.env.VITE_API_URL || "/api";
        const res = await axios.get(`${apiBase}/clinic/cases/public/invoice/${caseId}`);
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

  const { patient = {}, clinicCase = {}, visits = [], settings = {} } = data || {};
  const chargesPerDay = visits.length > 0 ? (visits[0]?.paymentAmount || 0) : 0;
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

  const isPaid = visits.length > 0 && visits.every((v) => v.paymentStatus === "Paid");
  const paymentStatus = isPaid ? "Paid" : "Unpaid";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100/50 py-10 px-4 flex flex-col items-center">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          box-sizing: border-box;
        }
        .invoice-container {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        @page {
          margin: 10mm 12mm;
        }
        @media print {
          body {
            background-color: white !important;
          }
          .invoice-container {
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
        }
      `}} />
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
      <div className="invoice-container w-full max-w-[650px] border border-slate-200 px-5 py-7 flex flex-col bg-white rounded-none shadow-md box-border text-slate-700 print:shadow-none print:border print:border-slate-200 print:my-0 print:mx-auto">
        {/* Logo and Header block */}
        <div className="flex justify-between items-start gap-6">
          <div className="flex flex-col text-left">
            <div className="px-5 py-2.5 text-white text-sm font-extrabold uppercase tracking-widest rounded-none shadow-sm" style={{ backgroundColor: "var(--primary)" }}>
              {settings.name || "PhysioCare"}
            </div>
            <div className="text-[10px] text-slate-500 font-bold mt-4 space-y-1.5 leading-relaxed font-accent tracking-wider">
              <p className="m-0 text-slate-600 font-semibold">{settings.address || "Address not available"}</p>
              <p className="m-0 text-slate-500 font-medium">☎ {settings.phone || "Phone not available"}</p>
              <p className="m-0 lowercase font-semibold text-slate-500">{(settings.emailGeneral || settings.email || "").toLowerCase()}</p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <h1 className="text-3xl font-black tracking-widest uppercase m-0 leading-none" style={{ color: "var(--primary)" }}>INVOICE</h1>
            
            <table className="border border-slate-200 text-[10px] font-bold mt-4 w-52 border-collapse overflow-hidden rounded-none shadow-sm bg-white">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="px-3.5 py-2 text-white w-20 text-center uppercase tracking-wider font-extrabold border-r border-slate-250" style={{ backgroundColor: "var(--primary)" }}>DATE</td>
                  <td className="px-3.5 py-2 text-slate-750 bg-white text-center font-mono font-medium">{currentDateStr}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="px-3.5 py-2 text-white w-20 text-center uppercase tracking-wider font-extrabold border-r border-slate-250" style={{ backgroundColor: "var(--primary)" }}>INVOICE NO.</td>
                  <td className="px-3.5 py-2 text-slate-750 bg-white text-center font-mono font-medium">{invoiceNo}</td>
                </tr>
                <tr>
                  <td className="px-3.5 py-2 text-white w-20 text-center uppercase tracking-wider font-extrabold border-r border-slate-250" style={{ backgroundColor: "var(--primary)" }}>STATUS</td>
                  <td className={`px-3.5 py-2 text-slate-750 bg-white text-center uppercase font-black ${paymentStatus === "Paid" ? "text-emerald-600 font-black" : "text-amber-500 font-black"}`}>{paymentStatus}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full h-[1px] bg-slate-100 my-6"></div>

        {/* Bill To & Invoice Details */}
        <div className="grid grid-cols-2 gap-6">
          <div className="border border-slate-200 rounded-none overflow-hidden flex flex-col text-left shadow-sm bg-white">
            <div className="px-4 py-2.5 text-[10px] font-bold text-white uppercase tracking-wider" style={{ backgroundColor: "var(--primary)" }}>
              BILL TO
            </div>
            <div className="p-4 text-xs font-bold text-slate-700 space-y-1">
              <p className="m-0 text-secondary text-sm font-extrabold">{patient.name}</p>
              <p className="m-0 text-slate-500 font-semibold">{patient.phone || "—"}</p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-none overflow-hidden flex flex-col text-left shadow-sm bg-white">
            <div className="px-4 py-2.5 text-[10px] font-bold text-white uppercase tracking-wider" style={{ backgroundColor: "var(--primary)" }}>
              INVOICE DETAILS
            </div>
            <div className="p-4 text-xs font-bold text-slate-750 space-y-1.5 leading-relaxed bg-bg-offwhite">
              <div><span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Patient Ref:</span> <span className="text-secondary font-extrabold font-mono">{patientCode}</span></div>
              <div><span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Due Date:</span> <span className="text-secondary font-extrabold">{endDateStr}</span></div>
              <div><span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Case:</span> <span className="text-secondary font-extrabold">{clinicCase.title}</span></div>
            </div>
          </div>
        </div>

        {/* Main Invoice Table */}
        <div className="border border-slate-200 rounded-none overflow-hidden mt-6 shadow-sm">
          <table className="w-full text-xs font-semibold text-slate-700 text-left border-collapse">
            <thead>
              <tr className="text-white text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: "var(--primary)" }}>
                <th className="w-[5%] py-2.5 px-4 text-center border-r border-white/10">#</th>
                <th className="w-[50%] py-2.5 px-4 border-r border-white/10">Description</th>
                <th className="w-[10%] py-2.5 px-4 text-center border-r border-white/10">QTY</th>
                <th className="w-[15%] py-2.5 px-4 text-right border-r border-white/10">Unit Price</th>
                <th className="w-[20%] py-2.5 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200 hover:bg-slate-50/20 bg-white">
                <td className="py-3 px-4 text-center border-r border-slate-200 font-bold">1</td>
                <td className="py-3 px-4 border-r border-slate-200 text-left">
                  <div className="font-extrabold text-secondary text-xs">{clinicCase.treatment || "Physiotherapy Session"}</div>
                  <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{startDateStr} – {endDateStr}</div>
                </td>
                <td className="py-3 px-4 text-center border-r border-slate-200 font-mono font-bold">{daysCount}</td>
                <td className="py-3 px-4 text-right border-r border-slate-200 font-mono whitespace-nowrap">₹ {chargesPerDay.toFixed(2)}</td>
                <td className="py-3 px-4 text-right font-mono font-bold whitespace-nowrap">₹ {totalAmount.toFixed(2)}</td>
              </tr>
              {/* Empty rows for design padding matching the screenshot */}
              <tr className="bg-slate-50/10 border-b border-slate-200/50 min-h-[36px]">
                <td className="py-3.5 border-r border-slate-200/50"></td>
                <td className="py-3.5 border-r border-slate-200/50"></td>
                <td className="py-3.5 border-r border-slate-200/50"></td>
                <td className="py-3.5 border-r border-slate-200/50"></td>
                <td className="py-3.5"></td>
              </tr>
              <tr className="bg-white border-b border-slate-200/50 min-h-[36px]">
                <td className="py-3.5 border-r border-slate-200/50"></td>
                <td className="py-3.5 border-r border-slate-200/50"></td>
                <td className="py-3.5 border-r border-slate-200/50"></td>
                <td className="py-3.5 border-r border-slate-200/50"></td>
                <td className="py-3.5"></td>
              </tr>
              <tr className="bg-slate-50/10 min-h-[36px]">
                <td className="py-3.5 border-r border-slate-200/50"></td>
                <td className="py-3.5 border-r border-slate-200/50"></td>
                <td className="py-3.5 border-r border-slate-200/50"></td>
                <td className="py-3.5 border-r border-slate-200/50"></td>
                <td className="py-3.5"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6 items-start">
          <div className="text-left text-xs font-bold text-slate-700 space-y-4 pt-1">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Physiotherapist:</span>
              <span className="text-secondary font-extrabold text-xs">{clinicCase.consultingDoctor?.name || "Yash Patel"}</span>
            </div>
            
            {settings.receivedSign && (
              <div className="pt-2 flex items-center gap-3">
                <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Received Sign:</span>
                <div className="relative border-b border-slate-200 w-36 h-10 flex items-center justify-center">
                  <img src={settings.receivedSign} alt="Signature" className="absolute bottom-0.5 h-11 object-contain" />
                </div>
              </div>
            )}
          </div>

          <div className="border border-slate-200 rounded-none overflow-hidden shadow-sm ml-auto w-full max-w-[270px] bg-white">
            <table className="w-full text-xs font-bold text-slate-700 border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="px-4 py-2.5 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">Subtotal</td>
                  <td className="px-4 py-2.5 text-right font-mono font-medium">₹ {totalAmount.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="px-4 py-2.5 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">Amount Paid</td>
                  <td className="px-4 py-2.5 text-right font-mono font-medium">₹ {(paymentStatus === "Paid" ? totalAmount : 0).toFixed(2)}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="px-4 py-2.5 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">Balance Due</td>
                  <td className="px-4 py-2.5 text-right font-mono font-medium">₹ {(paymentStatus === "Paid" ? 0 : totalAmount).toFixed(2)}</td>
                </tr>
                <tr className="text-white" style={{ backgroundColor: "var(--primary)" }}>
                  <td className="px-4 py-3 text-xs uppercase tracking-widest font-black">Grand Total</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-black">₹ {totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full h-[1px] bg-slate-100 mt-10 mb-5"></div>
        <div className="text-center space-y-1">
          <h3 className="text-sm font-bold uppercase tracking-widest font-heading m-0" style={{ color: "var(--primary)" }}>THANK YOU</h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-accent m-0">Generated on {currentDateStr} @ {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
          <p className="text-[8px] font-bold text-slate-350 uppercase tracking-widest font-accent m-0">POWERED BY {settings.name?.toUpperCase() || "PHYSIOCARE"}</p>
        </div>
      </div>
    </div>
  );
};

export default PublicInvoiceView;
