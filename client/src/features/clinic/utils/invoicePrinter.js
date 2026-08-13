import toast from "react-hot-toast";

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

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

  const logoHtml = settings.logo
    ? `<img src="${settings.logo}" alt="Logo" class="max-h-[70px] max-w-[120px] object-contain" />`
    : `<div class="w-[70px] h-[70px] bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 text-2xl">${getInitials(settings.name)}</div>`;

  const caduceusUrl = `${window.location.origin}/caduceus.png`;
  const caduceusHtml = `<img src="${caduceusUrl}" alt="Caduceus" class="max-h-[70px] max-w-[120px] object-contain" />`;

  // Write base document structure
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${patient.name}</title>
      <style>
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .invoice-container {
            border: 2px solid black !important;
          }
        }
      </style>
    </head>
    <body class="bg-white p-5 flex justify-center">
      <div class="invoice-container w-full max-w-[650px] border-2 border-black p-6 flex flex-col bg-white box-border text-black">
        <!-- Logos and Clinic Name Row -->
        <div class="flex justify-between items-center gap-4 mb-1">
          <div class="w-[20%] flex justify-start items-center">${logoHtml}</div>
          <div class="w-[60%] flex flex-col items-center justify-center text-center">
            <h1 class="text-3xl font-black tracking-wide uppercase font-serif m-0">${settings.name}</h1>
            <div class="flex items-center justify-center w-full mt-1.5">
              <div class="flex-grow h-[2px] bg-black"></div>
              <span class="px-2.5 text-xs font-bold uppercase tracking-wider shrink-0">Physiotherapy Clinic</span>
              <div class="flex-grow h-[2px] bg-black"></div>
            </div>
          </div>
          <div class="w-[20%] flex justify-end items-center">${caduceusHtml}</div>
        </div>

        <div class="w-full h-[1.5px] bg-black my-2.5"></div>

        <!-- Address and Phone centered -->
        <div class="text-center text-[11px] font-bold leading-normal mb-1">
          <p class="m-0.5">${settings.address || "Address not available"}</p>
          <p class="m-0.5">☎ ${settings.phone || "Phone not available"}</p>
        </div>

        <div class="w-full h-[1px] bg-black mt-1 mb-2.5"></div>

        <!-- Meta details layout -->
        <div class="mt-3.5 text-xs font-bold leading-loose">
          <div class="flex justify-between mb-2">
            <div class="flex w-[45%] items-baseline">
              <span class="shrink-0">No.</span>
              <div class="border-b border-black flex-grow ml-1.5 pl-1.5 font-normal">${invoiceNo}</div>
            </div>
            <div class="flex w-[45%] items-baseline">
              <span class="shrink-0">Date:</span>
              <div class="border-b border-black flex-grow ml-1.5 pl-1.5 font-normal">${currentDateStr}</div>
            </div>
          </div>
          <div class="flex w-full items-baseline mb-2">
            <span class="shrink-0">Name:</span>
            <div class="border-b border-black flex-grow ml-1.5 pl-1.5 font-normal">${patient.name} (${patient.phone || "—"})</div>
          </div>
        </div>

        <!-- Main Invoice Table -->
        <table class="w-full border-collapse border border-black mt-4 table">
          <thead>
            <tr class="border-b border-black">
              <th class="w-[10%] border-r border-black p-1.5 text-xs font-bold uppercase text-center">Sr. No.</th>
              <th class="w-[90%] p-1.5 text-xs font-bold uppercase text-center">PHYSIOTHERAPY</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-black">
              <td class="w-[10%] border-r border-black p-2.5 text-center align-top font-bold">1</td>
              <td class="w-[90%] p-2.5 align-top">
                <div class="flex flex-col justify-between min-h-[220px] h-full w-full">
                  <div class="text-sm font-bold mb-5">Case Name: ${clinicCase.title}</div>
                  
                  <div class="text-xs font-bold leading-relaxed mt-auto pt-10">
                    <div>Date : ${startDateStr} to ${endDateStr}</div>
                    <div>Charges Per Day : ₹ ${chargesPerDay.toFixed(2)}</div>
                    <div>Days : ${daysCount}</div>
                  </div>
                </div>
              </td>
            </tr>
            <tr class="h-10">
              <td class="border-r border-black"></td>
              <td class="text-right font-bold text-xs p-2">
                Total &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ₹ ${totalAmount.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Received Sign -->
        <div class="mt-20 flex justify-end text-xs font-bold pr-2.5">
          <div class="flex items-end gap-2">
            <span class="pb-1">Received Sign:</span>
            <div class="relative w-[160px] border-b border-black flex justify-center pb-0.5">
              ${settings.receivedSign
                ? `<img src="${settings.receivedSign}" alt="Signature" class="absolute bottom-0 h-[65px] max-w-[150px] object-contain pointer-events-none" />`
                : `<div class="h-6"></div>`
              }
            </div>
          </div>
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
