import React from "react";

const Spinner = ({ text = "Loading...", fullScreen = false }) => (
  <div className={`flex flex-col items-center justify-center text-center p-6 ${fullScreen ? "fixed inset-0 z-50 bg-white/80 backdrop-blur-sm" : "min-h-[200px]"}`}>
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    {text && <p className="text-text-muted text-sm font-semibold tracking-wide mt-4 font-accent">{text}</p>}
  </div>
);

export default Spinner;
