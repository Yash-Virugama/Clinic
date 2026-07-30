import { createPortal } from "react-dom";

const ModalShell = ({ isOpen, onClose, title, children, zIndex = "z-[9999]", panelClassName = "sm:max-w-md" }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className={`fixed inset-0 ${zIndex} flex items-center justify-center sm:p-4`}>
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm z-[9998]" />

      <div className={`bg-white border border-slate-200/60 rounded-[32px] p-6 sm:p-8 w-[calc(100%-2rem)] max-h-[95vh] overflow-y-auto no-scrollbar sm:w-full shadow-2xl relative z-[9999] animate-page-entrance text-left ${panelClassName}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold font-heading text-secondary">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {children}
      </div>
    </div>,
    document.body
  );
};

export default ModalShell;
