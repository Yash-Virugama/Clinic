import { useState, useRef, useEffect } from "react";

const CustomSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  theme = "light",
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Keep search query text in sync with selection updates
  useEffect(() => {
    if (selectedOption) {
      setSearchQuery(selectedOption.label);
    } else {
      setSearchQuery("");
    }
  }, [value, options, selectedOption]);

  // Handle clicking outside of dropdown element bounds
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        // Reset query text to matched label or blank when clicking away
        if (selectedOption) {
          setSearchQuery(selectedOption.label);
        } else {
          setSearchQuery("");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedOption]);

  // Filter list matching characters typed by the user
  const filteredOptions = options.filter((opt) => {
    // If input matches selection, show all options on focus click
    if (selectedOption && searchQuery === selectedOption.label) {
      return true;
    }
    return (opt.label || "").toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
    // Clear selection state if query is backspaced entirely
    if (e.target.value === "") {
      onChange("");
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    // Highlight existing text for easy replacement
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  return (
    <div className="relative w-full text-left" ref={containerRef}>
      
      {searchable ? (
        /* Combobox search input trigger */
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className={`rounded-2xl text-sm font-medium transition-all shadow-sm w-full bg-white/70 focus:bg-white border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary px-4 py-3 pr-10 text-secondary placeholder:text-slate-400 ${
              isOpen ? "border-primary" : "border-slate-200/80"
            }`}
          />
          {/* Toggle Chevron Arrow Icon */}
          <div 
            onClick={() => setIsOpen(!isOpen)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-slate-400"
          >
            <svg
              className={`w-4 h-4 stroke-[2.2] transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      ) : (
        /* Standard static button trigger */
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

          <svg
            className={`w-4 h-4 stroke-[2.2] transition-transform duration-300
              ${theme === "dark" ? "text-white" : "text-slate-400"} 
              ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      )}

      {/* Option List Overlay Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white/95 border border-slate-200/60 backdrop-blur-md rounded-2xl shadow-xl z-[99999] overflow-hidden flex flex-col max-h-60">
          <div className="overflow-y-auto no-scrollbar flex-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4.5 py-4 text-xs text-slate-400 italic text-center">
                No matching options
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setSearchQuery(opt.label);
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
              })
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomSelect;
