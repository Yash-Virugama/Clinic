import React, { useState, useEffect, useRef } from "react";
import { StatusPill, getStatusTone } from "./tabs/TabHelpers";
import { formatDateDDMMYYYY } from "../utils/clinicFormatters";

const CaseListCard = ({ clinicCase, index, visits, records, files, onEdit, onUpdateStatus, onDelete }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowStatusMenu(false);
      }
    };
    if (showStatusMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusMenu]);

  return (
    <div className="border border-slate-150 rounded-2xl p-4.5 bg-bg-offwhite shadow-sm flex flex-col justify-between hover:border-primary/20 transition-all text-left">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0">
            {index}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-secondary truncate">{clinicCase.title}</h3>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <StatusPill tone={getStatusTone(clinicCase.status)}>{clinicCase.status}</StatusPill>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onEdit(clinicCase)}
            className="w-8 h-8 rounded-xl border border-slate-200 hover:border-primary/40 text-slate-400 hover:text-primary flex items-center justify-center shrink-0 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <svg className="w-3.5 h-3.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>

          {/* Three dots dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="w-4 h-4 text-slate-400 hover:text-primary flex items-center justify-center shrink-0 transition-all cursor-pointer"
              title="Change Status"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
            {showStatusMenu && (
              <div className="absolute right-6 -top-12 sm:-top-5 sm:right-5 mt-1.5 w-36 bg-white border border-slate-200/80 backdrop-blur-md rounded-2xl shadow-xl py-1.5 z-50 animate-page-entrance slide-in-from-top-1 duration-200">
                {/* Active */}
                <button
                  onClick={() => {
                    setShowStatusMenu(false);
                    if (clinicCase.status !== "Active") onUpdateStatus("Active");
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-emerald-600 hover:bg-emerald-50/40 transition-colors"
                >
                  Active
                </button>

                {/* Resolved */}
                <button
                  onClick={() => {
                    setShowStatusMenu(false);
                    if (clinicCase.status !== "Resolved") onUpdateStatus("Resolved");
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-blue-600 hover:bg-blue-50/40 transition-colors"
                >
                  Resolved
                </button>

                {/* Closed */}
                <button
                  onClick={() => {
                    setShowStatusMenu(false);
                    if (clinicCase.status !== "Cancelled") onUpdateStatus("Cancelled");
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-amber-600 hover:bg-amber-50/40 transition-colors"
                >
                  Cancelled
                </button>

                {/* Cancelled */}
                <button
                  onClick={() => {
                    setShowStatusMenu(false);
                    if (clinicCase.status !== "Closed") onUpdateStatus("Closed");
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-rose-600 hover:bg-rose-50/40 transition-colors"
                >
                  Closed
                </button>

                {/* Divider */}
                <div className="border-t border-slate-200 my-0.5"></div>

                {/* Delete */}
                <button
                  onClick={() => {
                    setShowStatusMenu(false);
                    onDelete();
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-amber-600 hover:bg-amber-50/40 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-accent">
        <span>Opened: {formatDateDDMMYYYY(clinicCase.createdAt)}</span>
        <span>{visits.length} sessions</span>
        <span className="text-emerald-600 font-bold">{records.length + files.length} records</span>
      </div>
    </div>
  );
};

export default CaseListCard;
