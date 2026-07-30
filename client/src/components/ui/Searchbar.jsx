import React from "react";

const Searchbar = ({ value, onChange, placeholder = "Search...", className = "" }) => (
  <div className={`relative flex-1 ${className}`}>
    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </span>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full py-2.5 pl-10 pr-14 rounded-xl border border-slate-200/80 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-xs font-medium transition-all shadow-sm"
    />
    {value && (
      <button
        onClick={() => onChange("")}
        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-secondary cursor-pointer"
      >
        Clear
      </button>
    )}
  </div>
);

export default Searchbar;
