import { createPortal } from "react-dom";

const CustomConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isLoading = false }) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[9998] animate-fade-in"
        onClick={isLoading ? undefined : onClose}
        style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
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
            disabled={isLoading}
            style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
            className="px-4.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-100 hover:bg-slate-200/60 text-slate-600 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
            className="px-4.5 py-2.5 rounded-2xl border border-primary bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer shadow hover:shadow-md flex items-center justify-center gap-2 min-w-[140px]"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              "Confirm Delete"
            )}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

export default CustomConfirmModal;
