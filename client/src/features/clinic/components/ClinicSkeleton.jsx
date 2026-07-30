import React from "react";

const ClinicSkeleton = ({ type = "grid", count = 6 }) => {
  // 1. Grid of cards loader (for patients list, etc.)
  if (type === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200/50 p-5 rounded-3xl shadow-sm animate-pulse space-y-4"
          >
            {/* Top row badge placeholders */}
            <div className="flex justify-between items-center">
              <div className="w-16 h-5 bg-slate-200 rounded-lg"></div>
              <div className="w-12 h-5 bg-slate-200 rounded-lg"></div>
            </div>

            {/* Name placeholder */}
            <div className="w-2/3 h-5 bg-slate-200 rounded-xl mt-3"></div>

            {/* Divider and bottom details */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
              <div className="w-24 h-4 bg-slate-100 rounded-lg"></div>
              <div className="w-12 h-4 bg-slate-100 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Full-page details layout loader
  if (type === "details") {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        {/* Top Back Action placeholder */}
        <div className="w-28 h-4 bg-slate-200 rounded-lg"></div>

        {/* Patient Core details card placeholder */}
        <div className="bg-white border border-slate-200/50 p-6 sm:p-8 rounded-[32px] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1/3 h-7 bg-slate-200 rounded-xl"></div>
            <div className="w-16 h-5 bg-slate-200 rounded-lg"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
              <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0"></div>
              <div className="space-y-1.5 w-full">
                <div className="w-16 h-3 bg-slate-200 rounded"></div>
                <div className="w-24 h-4 bg-slate-200 rounded-lg"></div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
              <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0"></div>
              <div className="space-y-1.5 w-full">
                <div className="w-16 h-3 bg-slate-200 rounded"></div>
                <div className="w-20 h-4 bg-slate-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes sections placeholder layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="w-48 h-5 bg-slate-200 rounded-lg mb-2"></div>
            
            {/* Notes placeholders list */}
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="bg-white border border-slate-200/50 p-5 rounded-2xl shadow-sm space-y-3">
                <div className="w-16 h-4 bg-slate-200 rounded"></div>
                <div className="w-full h-4 bg-slate-100 rounded"></div>
                <div className="w-3/4 h-4 bg-slate-100 rounded"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="w-20 h-3 bg-slate-100 rounded"></div>
                  <div className="w-24 h-3 bg-slate-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Add note panel placeholder */}
          <div className="bg-white border border-slate-200/50 p-5 sm:p-6 rounded-3xl shadow-sm space-y-5 h-fit">
            <div className="w-32 h-4 bg-slate-200 rounded"></div>
            <div className="space-y-1.5">
              <div className="w-20 h-3 bg-slate-200 rounded"></div>
              <div className="w-full h-9 bg-slate-100 rounded-xl"></div>
            </div>
            <div className="space-y-1.5">
              <div className="w-24 h-3 bg-slate-200 rounded"></div>
              <div className="w-full h-24 bg-slate-100 rounded-xl"></div>
            </div>
            <div className="w-full h-10 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ClinicSkeleton;
