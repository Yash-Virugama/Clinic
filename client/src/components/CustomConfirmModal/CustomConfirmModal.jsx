import { createPortal } from "react-dom";

const CustomConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[9998] animate-fade-in"
        onClick={onClose}
        style={{ cursor: "pointer" }}
      />
      {/* Modal Container */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-page-entrance bg-white/95 border border-slate-200/60 backdrop-blur-md rounded-[32px] p-6 sm:p-8 shadow-2xl w-[calc(100%-2rem)] sm:w-full sm:max-w-md z-[9999] animate-fade-in text-left flex flex-col gap-5">
        <div>
          <h3 className="text-base font-bold text-secondary font-heading mb-1.5">{title || "Confirm Action"}</h3>
          <p className="text-xs text-text-muted leading-relaxed font-body">{message || "Are you sure you want to proceed?"}</p>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            style={{ cursor: "pointer" }}
            className="px-4.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-100 hover:bg-slate-200/60 text-slate-600 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{ cursor: "pointer" }}
            className="px-4.5 py-2.5 rounded-2xl border border-primary bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow hover:shadow-md"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

export default CustomConfirmModal;
