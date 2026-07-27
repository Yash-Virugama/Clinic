import React from "react";

const Icon = ({ name, className = "w-4 h-4" }) => {
  const common = { className, fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24" };

  if (name === "folder") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5A2.5 2.5 0 015.5 5h4l2 2h7A2.5 2.5 0 0121 9.5v7A2.5 2.5 0 0118.5 19h-13A2.5 2.5 0 013 16.5v-9z" /></svg>;
  }
  return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M12 17v-6m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
};

const Metric = ({ count, label }) => (
  <div className="flex flex-col items-center">
    <span className="text-xl font-bold text-primary">{count}</span>
    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{label}</span>
  </div>
);

const getStatusClasses = (status) => {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-600 border-emerald-200";
    case "Resolved":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "Cancelled":
      return "bg-amber-50 text-amber-650 border-amber-200";
    case "Closed":
      return "bg-rose-50 text-rose-600 border-rose-200";
    default:
      return "bg-slate-50 text-slate-650 border-slate-200";
  }
};

const CaseSummaryCard = ({ selectedCase, caseIndex, visitsCount, recordsCount, filesCount, onNavigateToTabs, formatDate }) => {
  return (
    <div className="border border-primary/20 rounded-2xl shadow-inner overflow-hidden bg-primary/2">
      {/* Banner */}
      <div className="px-5 py-3.5 bg-primary/5 border-b border-primary/10 flex items-center justify-between gap-3 text-[#1e3a8a]">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Icon name="folder" className="w-4.5 h-4.5 text-slate-400" />
          Active Case
        </span>
        <button
          type="button"
          onClick={onNavigateToTabs}
          className="text-xs font-bold text-primary hover:text-primary-hover cursor-pointer"
        >
          View All Cases
        </button>
      </div>

      {/* Summary Body */}
      <div className="px-3.5 py-5 sm:p-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-sm font-bold shrink-0">
            {caseIndex}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-secondary leading-snug">{selectedCase.title}</h3>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getStatusClasses(selectedCase.status || "Active")}`}>
                {selectedCase.status || "Active"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5 font-accent">
              Opened: {formatDate ? formatDate(selectedCase.createdAt) : new Date(selectedCase.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Metric Row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100/70 text-center">
          <Metric count={visitsCount} label="Visits" />
          <Metric count={recordsCount} label="Clinical Records" />
          <Metric count={filesCount} label="Documents" />
        </div>
      </div>
    </div>
  );
};

export default CaseSummaryCard;
