import toast from "react-hot-toast";

export const printInvoice = ({ patient, clinicCase, visits, settings, patientCode }) => {
  // Calculate details
  const chargesPerDay = visits.length > 0 ? visits[0].paymentAmount : 0;

  // Start Date: Case opened date (clinicCase.createdAt)
  const caseOpenedDate = clinicCase.createdAt ? new Date(clinicCase.createdAt) : new Date();
  const startDateStr = caseOpenedDate.toLocaleDateString("en-IN");

  // End Date: Last time status changed date (clinicCase.updatedAt)
  const lastStatusChangedDate = clinicCase.updatedAt ? new Date(clinicCase.updatedAt) : new Date();
  const endDateStr = lastStatusChangedDate.toLocaleDateString("en-IN");

  // Calculate days according to start and end date
  const startDay = new Date(caseOpenedDate);
  const endDay = new Date(lastStatusChangedDate);
  startDay.setHours(0, 0, 0, 0);
  endDay.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(endDay - startDay);
  const daysCount = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // Recalculate total based on chargesPerDay and calculated daysCount
  const totalAmount = chargesPerDay * daysCount;

  const invoiceNo = patientCode;
  const currentDateStr = new Date().toLocaleDateString("en-IN");

  // Open new window for print
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    toast.error("Popup blocked! Please allow popups to print invoices.");
    return;
  }

  const isPaid = visits.length > 0 && visits.every((v) => v.paymentStatus === "Paid");
  const paymentStatus = isPaid ? "Paid" : "Unpaid";

  // Write base document structure
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${patient.name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          box-sizing: border-box;
        }
        body {
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
      </style>
    </head>
    <body class="bg-slate-50/50 p-5 flex justify-center">
      <div class="invoice-container w-full max-w-[650px] border border-slate-200 px-5 py-7 flex flex-col bg-white rounded-none shadow-md box-border text-slate-700">
        <!-- Logo and Header block -->
        <div class="flex justify-between items-start gap-6">
          <div class="flex flex-col text-left">
            <div class="px-5 py-2.5 text-white text-sm font-extrabold uppercase tracking-widest rounded-none shadow-sm" style="background-color: var(--primary);">
              ${settings.name || "PhysioCare"}
            </div>
            <div class="text-[10px] text-slate-500 font-bold mt-4 space-y-1.5 leading-relaxed font-accent tracking-wider">
              <p class="m-0 text-slate-600 font-semibold">${settings.address || "Address not available"}</p>
              <p class="m-0 text-slate-500 font-medium">☎ ${settings.phone || "Phone not available"}</p>
              <p class="m-0 lowercase font-semibold text-slate-500">${(settings.emailGeneral || settings.email || "").toLowerCase()}</p>
            </div>
          </div>

          <div class="flex flex-col items-end">
            <h1 class="text-3xl font-black tracking-widest uppercase m-0 leading-none" style="color: var(--primary);">INVOICE</h1>
            
            <table class="border border-slate-200 text-[10px] font-bold mt-4 w-56 border-collapse overflow-hidden rounded-none shadow-sm bg-white">
              <tbody>
                <tr class="border-b border-slate-200">
                  <td class="px-3.5 py-2 text-white w-26 text-center uppercase tracking-wider font-extrabold border-r border-slate-250" style="background-color: var(--primary);">DATE</td>
                  <td class="px-3.5 py-2 text-[11px] text-slate-750 bg-bg-offwhite text-center font-mono font-medium">${currentDateStr}</td>
                </tr>
                <tr class="border-b border-slate-200">
                  <td class="px-3.5 py-2 text-white w-26 text-center uppercase tracking-wider font-extrabold border-r border-slate-250" style="background-color: var(--primary);">INVOICE NO.</td>
                  <td class="px-3.5 py-2 text-[11px] text-slate-750 bg-bg-offwhite text-center font-mono font-medium">${invoiceNo}</td>
                </tr>
                <tr>
                  <td class="px-3.5 py-2 text-white w-26 text-center uppercase tracking-wider font-extrabold border-r border-slate-250" style="background-color: var(--primary);">STATUS</td>
                  <td class="px-3.5 py-2 text-[11px] text-slate-750 bg-bg-offwhite text-center uppercase font-extrabold ${paymentStatus === "Paid" ? "text-emerald-600 font-black" : "text-amber-500 font-black"}">${paymentStatus}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="w-full h-[1px] bg-slate-100 my-6"></div>

        <!-- Bill To & Invoice Details -->
        <div class="grid grid-cols-2 gap-6">
          <!-- BILL TO -->
          <div class="border border-slate-200 rounded-none overflow-hidden flex flex-col text-left shadow-sm bg-bg-offwhite">
            <div class="px-4 py-2.5 text-[10px] font-bold text-white uppercase tracking-wider" style="background-color: var(--primary);">
              BILL TO
            </div>
            <div class="p-4 text-xs bg-bg-offwhite font-bold text-slate-700 space-y-1">
              <p class="m-0 text-secondary text-sm font-extrabold">${patient.name}</p>
              <p class="m-0 text-slate-500 font-medium">${patient.phone || "—"}</p>
            </div>
          </div>

          <!-- INVOICE DETAILS -->
          <div class="border border-slate-200 rounded-none overflow-hidden flex flex-col text-left shadow-sm bg-white">
            <div class="px-4 py-2.5 text-[10px] font-bold text-white uppercase tracking-wider" style="background-color: var(--primary);">
              INVOICE DETAILS
            </div>
            <div class="p-4 text-xs font-bold bg-bg-offwhite text-slate-750 space-y-1.5 leading-relaxed">
              <div><span class="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Patient Ref:</span> <span class="text-secondary font-extrabold font-mono">${patientCode}</span></div>
              <div><span class="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Due Date:</span> <span class="text-secondary font-extrabold">${endDateStr}</span></div>
              <div><span class="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Case:</span> <span class="text-secondary font-extrabold">${clinicCase.title}</span></div>
            </div>
          </div>
        </div>

        <!-- Main Invoice Table -->
        <div class="border border-slate-200 rounded-none overflow-hidden mt-6 shadow-sm">
          <table class="w-full text-xs font-semibold text-slate-700 text-left border-collapse">
            <thead>
              <tr class="text-white text-[10px] font-bold uppercase tracking-wider" style="background-color: var(--primary);">
                <th class="w-[5%] py-2.5 px-4 text-center border-r border-white/10">#</th>
                <th class="w-[50%] py-2.5 px-4 border-r border-white/10">Description</th>
                <th class="w-[10%] py-2.5 px-4 text-center border-r border-white/10">QTY</th>
                <th class="w-[15%] py-2.5 px-4 text-right border-r border-white/10">Unit Price</th>
                <th class="w-[20%] py-2.5 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-slate-200 hover:bg-slate-50/20 bg-white">
                <td class="py-3 px-4 text-center border-r border-slate-200 font-bold">1</td>
                <td class="py-3 px-4 border-r border-slate-200 text-left">
                  <div class="font-extrabold text-secondary text-xs">${clinicCase.treatment || "Physiotherapy Session"}</div>
                  <div class="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">${startDateStr} – ${endDateStr}</div>
                </td>
                <td class="py-3 px-4 text-center border-r border-slate-200 font-mono font-bold">${daysCount}</td>
                <td class="py-3 px-4 text-right border-r border-slate-200 font-mono whitespace-nowrap">₹ ${chargesPerDay.toFixed(2)}</td>
                <td class="py-3 px-4 text-right font-mono font-bold whitespace-nowrap">₹ ${totalAmount.toFixed(2)}</td>
              </tr>
              <!-- Empty rows for design padding matching the screenshot -->
              <tr class="bg-bg-offwhite border-b border-slate-200/50 min-h-[36px]">
                <td class="py-3.5 border-r border-slate-200/50"></td>
                <td class="py-3.5 border-r border-slate-200/50"></td>
                <td class="py-3.5 border-r border-slate-200/50"></td>
                <td class="py-3.5 border-r border-slate-200/50"></td>
                <td class="py-3.5"></td>
              </tr>
              <tr class="bg-white border-b border-slate-200/50 min-h-[36px]">
                <td class="py-3.5 border-r border-slate-200/50"></td>
                <td class="py-3.5 border-r border-slate-200/50"></td>
                <td class="py-3.5 border-r border-slate-200/50"></td>
                <td class="py-3.5 border-r border-slate-200/50"></td>
                <td class="py-3.5"></td>
              </tr>
              <tr class="bg-bg-offwhite min-h-[36px]">
                <td class="py-3.5 border-r border-slate-200/50"></td>
                <td class="py-3.5 border-r border-slate-200/50"></td>
                <td class="py-3.5 border-r border-slate-200/50"></td>
                <td class="py-3.5 border-r border-slate-200/50"></td>
                <td class="py-3.5"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="grid grid-cols-2 gap-6 mt-6 items-start">
          <!-- Left Column: Signatures and therapist info -->
          <div class="text-left text-xs font-bold text-slate-700 space-y-4 pt-1">
            <div>
              <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Physiotherapist:</span>
              <span class="text-secondary font-extrabold text-xs">${clinicCase.consultingDoctor?.name || "Yash Patel"}</span>
            </div>
            
            <!-- Signature Graphic block -->
            ${settings.receivedSign
              ? `
              <div class="pt-2 flex items-center gap-3">
                <span class="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Received Sign:</span>
                <div class="relative border-b border-slate-200 w-36 h-10 flex items-center justify-center">
                  <img src="${settings.receivedSign}" alt="Signature" class="absolute bottom-0.5 h-11 object-contain" />
                </div>
              </div>
              `
              : ""
            }
          </div>

          <!-- Right Column: Final Totals -->
          <div class="border border-slate-200 rounded-none overflow-hidden shadow-sm ml-auto w-full max-w-[270px]">
            <table class="w-full text-xs font-bold text-slate-700 border-collapse">
              <tbody>
                <tr class="border-b border-slate-200 bg-bg-offwhite">
                  <td class="px-4 py-2.5 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">Subtotal</td>
                  <td class="px-4 py-2.5 text-right font-mono font-medium">₹ ${totalAmount.toFixed(2)}</td>
                </tr>
                <tr class="border-b border-slate-200 bg-bg-offwhite">
                  <td class="px-4 py-2.5 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">Amount Paid</td>
                  <td class="px-4 py-2.5 text-right font-mono font-medium">₹ ${(paymentStatus === "Paid" ? totalAmount : 0).toFixed(2)}</td>
                </tr>
                <tr class="border-b border-slate-200 bg-bg-offwhite">
                  <td class="px-4 py-2.5 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">Balance Due</td>
                  <td class="px-4 py-2.5 text-right font-mono font-medium">₹ ${(paymentStatus === "Paid" ? 0 : totalAmount).toFixed(2)}</td>
                </tr>
                <tr class="text-white" style="background-color: var(--primary);">
                  <td class="px-4 py-3 text-xs uppercase tracking-widest font-black">Grand Total</td>
                  <td class="px-4 py-3 text-right font-mono text-sm font-black">₹ ${totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="w-full h-[1px] bg-slate-100 mt-10 mb-5"></div>
        <div class="text-center space-y-1">
          <h3 class="text-sm font-bold uppercase tracking-widest font-heading m-0" style="color: var(--primary);">THANK YOU</h3>
          <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-accent m-0">Generated on ${currentDateStr} @ ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
          <p class="text-[8px] font-bold text-slate-350 uppercase tracking-widest font-accent m-0">POWERED BY ${settings.name?.toUpperCase() || "PHYSIOCARE"}</p>
        </div>
      </div>
    </body>
    </html>
  `);

  // Copy document stylesheets dynamically from host to allow Tailwind styling
  Array.from(document.querySelectorAll('link[rel="stylesheet"], style')).forEach((styleNode) => {
    printWindow.document.head.appendChild(styleNode.cloneNode(true));
  });

  printWindow.document.close();

  // Trigger print after styles load
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 300);
};
