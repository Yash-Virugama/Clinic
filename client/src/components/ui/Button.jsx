import React from "react";

const Button = ({ variant = "primary", children, className = "", ...props }) => {
  const base = "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-60";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-primary/10",
    secondary: "bg-slate-100 hover:bg-slate-200 text-secondary",
    danger: "bg-red-500/10 hover:bg-red-500 text-red-650 hover:text-white",
    outline: "bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 hover:text-slate-800",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
