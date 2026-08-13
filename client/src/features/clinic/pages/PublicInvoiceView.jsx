import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../../../components/ui/Spinner";
import { FaPrint } from "react-icons/fa";
import { InvoiceTemplate } from "../components/InvoiceTemplate";


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
      // <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      //   <div className="flex flex-col items-center gap-3">
      //     <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      //     <p className="text-sm font-medium text-slate-500">Loading invoice details...</p>
      //   </div>
      // </div>
      <Spinner text="Loading invoice details..." fullScreen="true" />

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100/50 py-10 px-4 flex flex-col items-center print:bg-white print:py-0 print:px-0 print:min-h-0">
      <style dangerouslySetInnerHTML={{
        __html: `
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
            margin: 0;
            padding: 0;
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
      <div className="w-full max-w-[650px] bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center mb-6 print:hidden animate-fade-in">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-slate-650 font-accent uppercase tracking-wider">Patient Invoice View</span>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4.5 py-2 rounded-xl transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
        >
          <FaPrint className="w-3 h-3" />
          Print / Save PDF
        </button>
      </div>

      <InvoiceTemplate
        patient={patient}
        clinicCase={clinicCase}
        visits={visits}
        settings={settings}
      />
    </div>
  );
};

export default PublicInvoiceView;
