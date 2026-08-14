import React from "react";
import { generateClinicPatientId } from "../utils/clinicFormatters";

export const InvoiceTemplate = ({ patient = {}, clinicCase = {}, visits = [], settings = {} }) => {
  const patientCode = generateClinicPatientId(patient._id, settings?.name);

  // Date day calculations matching invoicePrinter.js
  const caseOpenedDate = clinicCase.createdAt ? new Date(clinicCase.createdAt) : new Date();
  const startDateStr = caseOpenedDate.toLocaleDateString("en-IN");

  const lastStatusChangedDate = clinicCase.updatedAt ? new Date(clinicCase.updatedAt) : new Date();
  const endDateStr = lastStatusChangedDate.toLocaleDateString("en-IN");

  // Calculations derived from database visits
  const visitsCount = visits.length;
  const paidAmount = visits.filter(v => v.paymentStatus === "Paid").reduce((sum, v) => sum + (v.paymentAmount || 0), 0);
  const rawUnpaidAmount = visits.filter(v => v.paymentStatus !== "Paid").reduce((sum, v) => sum + (v.paymentAmount || 0), 0);
  const subtotalAmount = paidAmount + rawUnpaidAmount;
  const averageUnitPrice = visitsCount > 0 ? (subtotalAmount / visitsCount) : 0;

  // Discount calculation
  const discountAmountVal = clinicCase.discountAmount || 0;
  const discountType = clinicCase.discountType || "";
  let calculatedDiscount = 0;
  if (discountType === "percentage") {
    calculatedDiscount = (subtotalAmount * discountAmountVal) / 100;
  } else if (discountType === "rupee") {
    calculatedDiscount = discountAmountVal;
  }
  calculatedDiscount = Math.min(calculatedDiscount, subtotalAmount);
  const grandTotalAmount = subtotalAmount - calculatedDiscount;
  const balanceDueAmount = Math.max(0, grandTotalAmount - paidAmount);

  const invoiceNo = patientCode;
  const currentDateStr = new Date().toLocaleDateString("en-IN");

  const paymentStatus = (visitsCount > 0 && balanceDueAmount === 0) ? "Paid" : "Unpaid";

  return (
    <div className="invoice-container w-full max-w-[650px] border border-slate-200 px-4 py-6 sm:px-5 sm:py-7 flex flex-col bg-white rounded-none shadow-md box-border text-slate-700 print:shadow-none print:border print:border-slate-200 print:my-0 print:mx-auto">
      {/* Logo and Header block */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 w-full">
        <div className="flex flex-col text-left">
          <div className="px-5 py-2.5 text-white text-sm font-extrabold uppercase tracking-widest rounded-none shadow-sm" style={{ backgroundColor: "var(--primary)" }}>
            {settings.name || "PhysioCare"}
          </div>
          <div className="text-[10px] text-slate-500 font-bold mt-4 space-y-1.5 leading-relaxed font-accent tracking-wider">
            <p className="m-0 text-slate-650 font-semibold">{settings.address || "Address not available"}</p>
            <p className="m-0 text-slate-500 font-medium">☎ {settings.phone || "Phone not available"}</p>
            <p className="m-0 lowercase font-semibold text-slate-500">{(settings.emailGeneral || settings.email || "").toLowerCase()}</p>
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
          <h1 className="text-3xl font-black tracking-widest uppercase m-0 leading-none" style={{ color: "var(--primary)" }}>INVOICE</h1>

          <table className="border border-slate-200 text-[10px] font-bold mt-4 w-full sm:w-56 border-collapse overflow-hidden rounded-none shadow-sm bg-white">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="px-3.5 py-2 text-white w-26 text-center uppercase tracking-wider font-extrabold border-r border-slate-250" style={{ backgroundColor: "var(--primary)" }}>DATE</td>
                <td className="px-3.5 py-2 text-[11px] text-slate-750 bg-bg-offwhite text-center font-mono font-medium">{currentDateStr}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-3.5 py-2 text-white w-26 text-center uppercase tracking-wider font-extrabold border-r border-slate-250" style={{ backgroundColor: "var(--primary)" }}>INVOICE NO.</td>
                <td className="px-3.5 py-2 text-[11px] uppercase text-slate-750 bg-bg-offwhite text-center font-mono font-medium">{invoiceNo}</td>
              </tr>
              <tr>
                <td className="px-3.5 py-2 text-white w-26 text-center uppercase tracking-wider font-extrabold border-r border-slate-250" style={{ backgroundColor: "var(--primary)" }}>STATUS</td>
                <td className={`px-3.5 py-2 text-[11px] text-slate-750 bg-bg-offwhite text-center uppercase font-extrabold ${paymentStatus === "Paid" ? "text-emerald-600 font-black" : "text-amber-500 font-black"}`}>{paymentStatus}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-full h-[1px] bg-slate-100 my-6"></div>

      {/* Bill To & Invoice Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* BILL TO */}
        <div className="border border-slate-200 rounded-none overflow-hidden flex flex-col text-left shadow-sm bg-bg-offwhite">
          <div className="px-4 py-2.5 text-[10px] font-bold text-white uppercase tracking-wider" style={{ backgroundColor: "var(--primary)" }}>
            BILL TO
          </div>
          <div className="p-4 text-xs bg-bg-offwhite font-bold text-slate-700 space-y-1">
            <div><span className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider">Patient:</span> <span className="text-secondary uppercase font-extrabold">{patient.name || "-"}</span></div>
            <div><span className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider">Mobile:</span> <span className="text-secondary font-extrabold">{patient.phone || "—"}</span></div>
            {/* <p className="m-0 text-secondary text-sm font-extrabold">{patient.name}</p>
            <p className="m-0 text-slate-500 font-medium">{patient.phone || "—"}</p> */}
          </div>
        </div>

        {/* INVOICE DETAILS */}
        <div className="border border-slate-200 rounded-none overflow-hidden flex flex-col text-left shadow-sm bg-white">
          <div className="px-4 py-2.5 text-[10px] font-bold text-white uppercase tracking-wider" style={{ backgroundColor: "var(--primary)" }}>
            INVOICE DETAILS
          </div>
          <div className="p-4 text-xs font-bold bg-bg-offwhite text-slate-750 space-y-1.5 leading-relaxed">
            <div><span className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider">Patient Ref:</span> <span className="text-secondary uppercase font-extrabold">{patientCode}</span></div>
            <div><span className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider">Due Date:</span> <span className="text-secondary font-extrabold">{endDateStr}</span></div>
            <div><span className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider">Case:</span> <span className="text-secondary font-extrabold">{clinicCase.title}</span></div>
          </div>
        </div>
      </div>

      {/* Main Invoice Table */}
      <div className="border border-slate-200 rounded-none overflow-hidden mt-6 shadow-sm w-full overflow-x-auto">
        <table className="w-full min-w-[580px] sm:min-w-0 text-xs font-semibold text-slate-700 text-left border-collapse">
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
              <td className="py-3 px-4 text-center border-r border-slate-200 font-mono font-bold">{visitsCount}</td>
              <td className="py-3 px-4 text-right border-r border-slate-200 font-mono whitespace-nowrap">₹ {averageUnitPrice.toFixed(2)}</td>
              <td className="py-3 px-4 text-right font-mono font-bold whitespace-nowrap">₹ {subtotalAmount.toFixed(2)}</td>
            </tr>
            {/* Empty rows for design padding matching the screenshot */}
            <tr className="bg-bg-offwhite border-b border-slate-200/50 min-h-[36px]">
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
            <tr className="bg-bg-offwhite min-h-[36px]">
              <td className="py-3.5 border-r border-slate-200/50"></td>
              <td className="py-3.5 border-r border-slate-200/50"></td>
              <td className="py-3.5 border-r border-slate-200/50"></td>
              <td className="py-3.5 border-r border-slate-200/50"></td>
              <td className="py-3.5"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-6 mt-6 items-start">
        <div className="text-left text-xs font-bold text-slate-700 space-y-4 pt-1 w-full">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Physiotherapist:</span>
            <span className="text-secondary font-extrabold text-xs">{clinicCase.consultingDoctor?.name || "Yash Patel"}</span>
          </div>

          {settings.receivedSign && (
            <div className="pt-2 flex items-center gap-3">
              <span className="text-[10px] text-slate-455 font-bold uppercase tracking-wider">Received Sign:</span>
              <div className="relative border-b border-slate-200 w-36 h-10 flex items-center justify-center">
                <img src={settings.receivedSign} alt="Signature" className="absolute bottom-0.5 h-11 object-contain" />
              </div>
            </div>
          )}
        </div>

        <div className="border border-slate-200 rounded-none overflow-hidden shadow-sm w-full sm:max-w-[270px] sm:ml-auto">
          <table className="w-full text-xs font-bold text-slate-700 border-collapse">
            <tbody>
              <tr className="border-b border-slate-200 bg-bg-offwhite">
                <td className="px-4 py-2.5 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">Subtotal</td>
                <td className="px-4 py-2.5 text-right font-mono font-medium">₹ {subtotalAmount.toFixed(2)}</td>
              </tr>
              {calculatedDiscount > 0 && (
                <tr className="border-b border-slate-200 bg-bg-offwhite">
                  <td className="px-4 py-2.5 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">
                    Discount {discountType === "percentage" ? `(${discountAmountVal}%)` : ""}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-medium text-rose-600">
                    - ₹ {calculatedDiscount.toFixed(2)}
                  </td>
                </tr>
              )}
              <tr className="border-b border-slate-200 bg-bg-offwhite">
                <td className="px-4 py-2.5 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">Amount Paid</td>
                <td className="px-4 py-2.5 text-right font-mono font-medium">₹ {paidAmount.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-slate-200 bg-bg-offwhite">
                <td className="px-4 py-2.5 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">Balance Due</td>
                <td className="px-4 py-2.5 text-right font-mono font-medium">₹ {balanceDueAmount.toFixed(2)}</td>
              </tr>
              <tr className="text-white" style={{ backgroundColor: "var(--primary)" }}>
                <td className="px-4 py-3 text-xs uppercase tracking-widest font-black">Grand Total</td>
                <td className="px-4 py-3 text-right font-mono text-sm font-black">₹ {grandTotalAmount.toFixed(2)}</td>
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
  );
};
