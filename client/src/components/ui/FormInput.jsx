import React from "react";

const FormInput = ({ label, type = "text", register, error, placeholder, className = "" }) => (
  <div className={`flex flex-col gap-2 w-full text-left ${className}`}>
    {label && <label className="text-[10px] font-bold text-secondary uppercase tracking-wider font-heading">{label}</label>}
    <input
      type={type}
      placeholder={placeholder}
      {...register}
      className={`w-full py-3 px-4.5 rounded-xl border bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-secondary text-xs font-medium transition-all ${
        error ? "border-red-500 focus:border-red-500" : "border-slate-200/80 focus:border-primary"
      }`}
    />
    {error && (
      <p className="text-xs text-red-500 font-semibold mt-1 font-accent">
        {error.message}
      </p>
    )}
  </div>
);

export default FormInput;
