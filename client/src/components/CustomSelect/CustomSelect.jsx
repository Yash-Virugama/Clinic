import { useState, useRef, useEffect } from "react";

const CustomSelect = ({ value, onChange, options = [], placeholder = "Select option", theme = "light" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside of the dropdown container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full text-left" ref={containerRef}>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-2xl text-sm font-medium transition-all shadow-sm flex items-center cursor-pointer 
          ${theme === "dark" ?
            "px-3.5 py-2.5 w-[100px] ms-auto justify-around bg-primary/90 border-none hover:bg-primary" :
            "px-4 py-3 w-full justify-between bg-white/70 focus:bg-white border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          }`}
      >

        <span
          className={
            selectedOption
              ? theme === "dark"
                ? "text-white"
                : "text-secondary"
              : "text-slate-400"
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Chevron Arrow Icon */}
        <svg
          className={`w-4 h-4 stroke-[2.2] transition-transform duration-300
            ${theme==="dark" ? "text-white" : "text-slate-400"} 
            ${isOpen ? "rotate-180" : ""
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Custom Option Dropdown Overlay */}
      {isOpen && (
        <div className={`absolute left-0 right-0 mt-2 bg-white/95 border border-slate-200/60 backdrop-blur-md rounded-2xl shadow-xl z-30 overflow-hidden max-h-60 overflow-y-auto no-scrollbar`}>
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-4.5 py-3 text-sm font-medium cursor-pointer transition-all flex items-center justify-between ${isSelected
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-slate-600 hover:bg-primary/5 hover:text-primary"
                  }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <svg className="w-4 h-4 text-primary stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default CustomSelect;
