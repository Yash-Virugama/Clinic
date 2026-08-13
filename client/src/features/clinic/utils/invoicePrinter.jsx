import React from "react";
import { renderToString } from "react-dom/server";
import toast from "react-hot-toast";
import { InvoiceTemplate } from "../components/InvoiceTemplate";

export const printInvoice = ({ patient, clinicCase, visits, settings }) => {
  // Open new window for print
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    toast.error("Popup blocked! Please allow popups to print invoices.");
    return;
  }

  const invoiceHtml = renderToString(
    <InvoiceTemplate
      patient={patient}
      clinicCase={clinicCase}
      visits={visits}
      settings={settings}
    />
  );

  // Write base document structure
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice - ${patient?.name || "Patient"}</title>
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
      ${invoiceHtml}
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
