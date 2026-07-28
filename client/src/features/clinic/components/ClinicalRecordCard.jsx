import React, { useState, useEffect, useRef } from "react";
import { formatDateDDMMYYYY } from "../utils/clinicFormatters";

const ClinicalRecordCard = ({ record, index, expanded, onToggleExpand, onEdit, onDelete }) => {
  const formattedDate = formatDateDDMMYYYY(record.createdAt);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="bg-white border border-slate-200/70 border-l-4 border-l-primary rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 relative text-left">
      {/* Header Row */}
      <div
        className="flex items-center justify-between gap-4 cursor-pointer select-none"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-black border border-primary/20 shrink-0 font-accent">
            {index}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-secondary font-accent leading-none">
                Clinical Record
              </span>
              <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">
                {formattedDate}
              </span>
            </div>
            {record.clinicCase && (
              <span className="inline-block text-[10px] font-extrabold text-primary font-accent bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10 mt-1 truncate max-w-[150px] sm:max-w-[280px]">
                Case: {record.clinicCase.title}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">

          {/* Chevron */}
          <div className="text-slate-400 hover:text-slate-600 transition-colors p-1">
              <svg className={`w-4 h-4 stroke-[2.2] ${expanded ? "transition-transform duration-300" : "rotate-180 transition-transform duration-300" }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
          </div>

          {/* Three dots dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="w-4 h-4 hover:border-primary/40 text-slate-400 hover:text-primary flex items-center justify-center shrink-0 transition-all cursor-pointer"
              title="Actions"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
            {showMenu && (
              <div className="absolute right-5 -top-6 sm:-top-5 sm:right-5 mt-1.5 w-30 bg-white border border-slate-200/80 backdrop-blur-md rounded-2xl shadow-xl py-1 z-50 animate-page-entrance slide-in-from-top-1 duration-200">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onEdit(record);
                  }}
                  className="w-full px-4 py-2 text-xs font-extrabold font-accent text-primary hover:bg-primary/3 hover:text-primary flex items-center gap-2 transition-colors cursor-pointer text-left"
                >
                  <svg className="w-3.5 h-3.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onDelete(record._id);
                  }}
                  className="w-full px-4 py-2 text-xs font-extrabold font-accent text-amber-600 hover:bg-amber-50/40 flex items-center gap-2 transition-colors cursor-pointer text-left"
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
      <div className={`grid transition-[grid-template-rows,margin-top] duration-300 ease-in-out ${expanded ? "grid-rows-[1fr] mt-4 pt-4 border-t border-slate-100" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="space-y-4">
            {/* Main complaint */}
            <div>
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-accent mb-1.5 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-primary stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
                Chief Complaint
              </h4>
              <p className="text-xs sm:text-sm font-semibold text-secondary leading-relaxed bg-bg-offwhite border border-slate-100 rounded-md shadow-inner sm:rounded-2xl p-3 sm:p-4">
                {record.chiefComplaint}
              </p>
            </div>

            {/* Diagnosis & Treatment Plan Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Diagnosis */}
              <div className="bg-bg-offwhite border border-slate-100 rounded-md shadow-inner sm:rounded-2xl p-3 sm:p-4">
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-primary font-accent mb-1 sm:mb-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-primary stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  Diagnosis
                </h4>
                <div className="text-xs font-semibold text-slate-700 leading-relaxed min-h-[2rem] flex items-center">
                  {record.diagnosis || <span className="text-slate-400/80 italic font-medium">No diagnosis recorded</span>}
                </div>
              </div>

              {/* Treatment Plan */}
              <div className="bg-bg-offwhite border border-slate-100 shadow-inner rounded-md sm:rounded-2xl p-3 sm:p-4">
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-primary font-accent mb-1 sm:mb-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-primary stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  Treatment Plan
                </h4>
                <div className="text-xs font-semibold text-slate-700 leading-relaxed min-h-[2rem] flex items-center">
                  {record.treatmentPlan ? (
                    <p className="whitespace-pre-line">{record.treatmentPlan}</p>
                  ) : (
                    <span className="text-slate-400/80 italic font-medium flex items-center h-full">No treatment plan recorded</span>
                  )}
                </div>
              </div>
            </div>

            {/* Alerts and Precautions */}
            {record.alertsAndPrecautions && (
              <div className="bg-rose-50/40 border border-rose-100/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-inner">
                <div className="flex items-center gap-2 mb-1.5">
                  <svg className="w-4 h-4 text-rose-500 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-rose-600 font-accent">
                    Alerts & Precautions
                  </h4>
                </div>
                <p className="text-xs font-extrabold text-rose-700 leading-relaxed pl-6">
                  {record.alertsAndPrecautions}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalRecordCard;
