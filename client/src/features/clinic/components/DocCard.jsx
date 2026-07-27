import React, { useState, useEffect, useRef } from "react";
import { formatDateDDMMYYYY } from "../utils/clinicFormatters";

const getFileTypeStyle = (type) => {
  switch (type) {
    case "MRI report":
      return "bg-indigo-50 border-indigo-100 text-indigo-600";
    case "x-ray":
      return "bg-teal-50 border-teal-100 text-teal-600";
    case "blood test":
      return "bg-rose-50 border-rose-100 text-rose-600";
    case "referral letter":
      return "bg-blue-50 border-blue-100 text-blue-600";
    case "prescription":
      return "bg-emerald-50 border-emerald-100 text-emerald-600";
    case "discharge summary":
      return "bg-amber-50 border-amber-100 text-amber-600";
    default:
      return "bg-slate-50 border-slate-200/60 text-slate-600";
  }
};

const getFileExtension = (url = "", name = "", fileType = "") => {
  const target = url || name || "";
  if (target) {
    const cleanUrl = target.split("?")[0].split("#")[0];
    const lastDotIndex = cleanUrl.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      const ext = cleanUrl.substring(lastDotIndex + 1).toLowerCase();
      if (/^[a-z0-9]{2,5}$/.test(ext)) {
        return ext.toUpperCase();
      }
    }
  }
  // Fallback based on semantic category
  if (fileType) {
    const type = fileType.toLowerCase();
    if (type === "x-ray") return "JPG";
    if (type === "other") return "DOCUMENT";
    return "PDF"; // default for reports, letters, prescriptions
  }
  return "DOCUMENT";
};

const DocCard = ({ file, index, expanded, onToggleExpand, onEdit, onDelete }) => {
  const formattedDate = formatDateDDMMYYYY(file.createdAt);
  const typeStyle = getFileTypeStyle(file.fileType);
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
                {file.fileName}
              </span>
              <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">
                {formattedDate}
              </span>
            </div>
            {file.clinicCase && (
              <span className="inline-block text-[10px] font-extrabold text-teal-600 font-accent bg-teal-50/40 px-2 py-0.5 rounded-md border border-teal-100 mt-1 truncate max-w-[150px] sm:max-w-[280px]">
                Case: {file.clinicCase.title}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">

          {/* Chevron */}
          <div className="text-slate-400 hover:text-slate-655 transition-colors p-1">
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
              className="w-4 h-4 rounded-xl text-slate-400 hover:text-teal-600 flex items-center justify-center shrink-0 transition-all cursor-pointer"
              title="Actions"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
            {showMenu && (
              <div className="absolute right-5 -top-8 sm:-top-5 sm:right-5 mt-1.5 w-36 bg-white border border-slate-200/80 backdrop-blur-md rounded-2xl shadow-xl py-1 z-50 animate-page-entrance slide-in-from-top-1 duration-200">
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-xs font-extrabold font-accent text-emerald-600 hover:bg-emerald-50/40 flex items-center gap-2 transition-colors cursor-pointer text-left"
                >
                  <svg className="w-3.5 h-3.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  View File
                </a>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onEdit(file);
                  }}
                  className="w-full px-4 py-2 text-xs font-extrabold font-accent text-primary hover:bg-primary/3 flex items-center gap-2 transition-colors cursor-pointer text-left"
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
                    onDelete(file._id);
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
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
            {/* Document Title & Type Badge */}
            <div>
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-accent mb-1.5">
                {getFileExtension(file.fileUrl, file.fileName, file.fileType)}
              </h4>
              <p className="text-sm font-semibold text-secondary leading-snug truncate mb-2" title={file.fileName}>
                {file.fileName}
              </p>
              <span className={`inline-block text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border font-accent ${typeStyle}`}>
                {file.fileType}
              </span>
            </div>

            {/* Notes */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 sm:p-4 shadow-inner flex flex-col justify-center">
              <h4 className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 font-accent mb-1.5 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-primary stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                Notes & Remarks
              </h4>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                {file.notes || <span className="text-slate-400/80 italic font-medium">No remarks or notes provided</span>}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocCard;
