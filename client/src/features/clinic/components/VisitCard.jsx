import React, { useState, useEffect, useRef } from "react";
import { formatDateDDMMYYYY } from "../utils/clinicFormatters";

const VisitCard = ({ visit, index, cases, expanded, onToggleExpand, onEdit, onUpdateStatus, onDelete }) => {
  const caseIndex = cases.findIndex((c) => c._id === (visit.clinicCase?._id || visit.clinicCase)) + 1;
  const caseTitle = visit.clinicCase?.title || "General";
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

  // Status coloring
  const statusColors = visit.status === "Completed"
    ? "border-emerald-500/30 text-emerald-600 bg-emerald-50/20"
    : visit.status === "Cancelled"
      ? "border-rose-500/30 text-rose-600 bg-rose-50/20"
      : "border-indigo-500/30 text-indigo-600 bg-indigo-50/20"; // Scheduled

  return (
    <div className="bg-bg-offwhite border border-slate-150 hover:border-slate-200/80 rounded-2xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.01)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300 text-left">
      {/* Header section (Clickable to toggle expand) */}
      <div className="flex items-center justify-between gap-3 cursor-pointer" onClick={onToggleExpand}>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-black border border-primary/20 font-accent">
            {index}
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-700 leading-none mb-1.5">
              {formatDateDDMMYYYY(visit.visitDate)}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 py-0.5 rounded-md border text-[9px] font-extrabold uppercase tracking-wider font-accent ${statusColors}`}>
                {visit.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Chevron */}
          <div className="text-slate-400 hover:text-slate-600 transition-colors p-1">
            {expanded ? (
              <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            ) : (
              <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            )}
          </div>

          {/* Edit button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent expanding when clicking edit
              onEdit();
            }}
            className="w-8 h-8 rounded-xl border border-slate-200 hover:border-primary/40 text-slate-400 hover:text-primary flex items-center justify-center shrink-0 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <svg className="w-3.5 h-3.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>

          {/* Direct status update (Three dots dropdown) */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowStatusMenu(!showStatusMenu);
              }}
              className="w-4 h-4 text-slate-400 hover:text-primary flex items-center justify-center shrink-0 transition-all cursor-pointer"
              title="Change Status"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
            {showStatusMenu && (
              <div className="absolute right-6 -top-12 sm:-top-5 sm:right-5 mt-1.5 w-36 bg-white border border-slate-200/80 backdrop-blur-md rounded-2xl shadow-xl py-1.5 z-50 animate-page-entrance slide-in-from-top-1 duration-200">
                {/* Scheduled */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusMenu(false);
                    if (visit.status !== "Scheduled") onUpdateStatus("Scheduled");
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-indigo-600 hover:bg-indigo-50/40 transition-colors"
                >
                  Scheduled
                </button>

                {/* Completed */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusMenu(false);
                    if (visit.status !== "Completed") onUpdateStatus("Completed");
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-emerald-600 hover:bg-emerald-50/40 transition-colors"
                >
                  Completed
                </button>

                {/* Cancelled */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusMenu(false);
                    if (visit.status !== "Cancelled") onUpdateStatus("Cancelled");
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-rose-600 hover:bg-rose-50/40 transition-colors"
                >
                  Cancelled
                </button>

                {/* Divider */}
                <div className="border-t border-slate-200 my-0.5"></div>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
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

      {/* Expanded details Accordion */}
      <div className={`grid transition-[grid-template-rows,margin-top] duration-300 ease-in-out ${expanded ? "grid-rows-[1fr] mt-3.5" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="border-t border-slate-200/80 pt-3.5 space-y-2.5">
            {/* Therapist row */}
            <div className="flex items-center gap-2.5 text-slate-500 text-xs font-semibold">
              <svg className="w-4 h-4 text-slate-400 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span>{visit.therapist?.name || "Unassigned"}</span>
            </div>

            {/* Location row */}
            <div className="flex items-center gap-2.5 text-slate-500 text-xs font-semibold">
              <svg className="w-4 h-4 text-slate-400 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12v18H3V3z" />
              </svg>
              <span className="capitalize">{visit.location}</span>
            </div>

            {/* Payment row */}
            <div className="flex items-center gap-2.5 text-slate-500 text-xs font-semibold">
              <svg className="w-4 h-4 text-slate-400 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-19.5 5.25h19.5m-19.5 0h19.5M4.5 18h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v9A2.25 2.25 0 004.5 18z" />
              </svg>
              <span className="text-emerald-600 font-bold">₹{visit.paymentAmount?.toFixed(2)}</span>
              <span className={`px-1.5 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-wider font-accent leading-none ${visit.paymentStatus === "Paid"
                ? "border-emerald-500/25 text-emerald-600 bg-emerald-50/20"
                : "border-rose-500/25 text-rose-600 bg-rose-50/20"
                }`}>
                {visit.paymentStatus}
              </span>
            </div>

            {/* Case folder link row */}
            {caseIndex > 0 && (
              <div className="flex items-center gap-2.5 text-slate-500 text-xs font-semibold">
                <svg className="w-4 h-4 text-slate-400 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.625-1.875a3.375 3.375 0 00-3.375 3.375M9 21h12m-12 0v-1.5m0 1.5H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                <span className="text-slate-400">{caseIndex} — <span className="text-slate-600 font-bold">{caseTitle}</span></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitCard;
