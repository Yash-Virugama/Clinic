import React from "react";
import CustomSelect from "../../../../components/ui/CustomSelect";

export const Icon = ({ name, className = "w-6 h-6" }) => {
  const common = { className, fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24" };

  if (name === "folder") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5A2.5 2.5 0 015.5 5h4l2 2h7A2.5 2.5 0 0121 9.5v7A2.5 2.5 0 0118.5 19h-13A2.5 2.5 0 013 16.5v-9z" /></svg>;
  }
  if (name === "clipboard") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6m-6 4h6m-6 4h3m-5-9h10a2 2 0 012 2v13H5V6a2 2 0 012-2zm2-2h6v4H9V2z" /></svg>;
  }
  if (name === "file") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5M9 15h6M9 18h4" /></svg>;
  }
  if (name === "clock") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  }
  if (name === "edit") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.651-1.65a1.875 1.875 0 112.652 2.651L9.75 16.904 6 18l1.096-3.75L18.512 2.837z" /></svg>;
  }
  if (name === "upload") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14" /></svg>;
  }
  if (name === "plus") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" /></svg>;
  }

  return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M12 17v-6m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
};

export const EmptyState = ({ icon, title, subtitle }) => (
  <div className="min-h-[220px] flex flex-col items-center justify-center text-center px-4 py-8 bg-slate-50/30 rounded-2xl border border-slate-100">
    <Icon name={icon} className="w-11 h-11 text-slate-300 mb-4" />
    <h3 className="text-sm font-bold text-slate-500">{title}</h3>
    <p className="text-xs text-slate-400 mt-1 max-w-sm">{subtitle}</p>
  </div>
);

export const StatusPill = ({ children, tone = "green" }) => {
  const tones = {
    green: "border-emerald-200 text-emerald-600 bg-emerald-50",
    blue: "border-blue-200 text-blue-600 bg-blue-50",
    amber: "border-amber-200 text-amber-600 bg-amber-50",
    rose: "border-rose-200 text-rose-600 bg-rose-50",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${tones[tone] || "border-slate-200 text-slate-600 bg-slate-50"}`}>
      {children}
    </span>
  );
};

export const getStatusTone = (status) => {
  switch (status) {
    case "Active":
      return "green";
    case "Resolved":
      return "blue";
    case "Cancelled":
      return "amber";
    case "Closed":
      return "rose";
    default:
      return "slate";
  }
};

export const CaseSelect = ({ cases, selectedCaseId, setSelectedCaseId, excludeGeneral = false }) => (
  <CustomSelect
    value={selectedCaseId}
    onChange={setSelectedCaseId}
    options={[
      ...(!excludeGeneral ? [{ value: "all", label: "General" }] : []),
      ...cases.map((clinicCase, index) => ({
        value: clinicCase._id,
        label: `Case ${index + 1} - ${clinicCase.title}`,
      }))
    ]}
    placeholder="Select Case"
  />
);

export const SectionToolbar = ({ cases, selectedCaseId, setSelectedCaseId, buttonLabel, buttonIcon, onAction, disabled, excludeGeneral = false }) => (
  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 sm:gap-4 items-center">
    <CaseSelect cases={cases} selectedCaseId={selectedCaseId} setSelectedCaseId={setSelectedCaseId} excludeGeneral={excludeGeneral} />
    <button
      onClick={onAction}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-primary-hover disabled:opacity-60 cursor-pointer shrink-0"
    >
      <Icon name={buttonIcon} className="w-4 h-4" />
      {buttonLabel}
    </button>
  </div>
);
