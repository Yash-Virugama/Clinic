import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, size = "md" }) => {
  if (totalPages <= 1) return null;

  const isSm = size === "sm";
  const btnClass = isSm 
    ? "w-9 h-9 text-xs rounded-lg" 
    : "w-11 h-11 text-sm rounded-xl";
  const svgClass = isSm
    ? "w-4 h-4"
    : "w-5 h-5";

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center border border-secondary/10 bg-white text-secondary transition-all shadow-sm cursor-pointer hover:border-primary hover:text-primary hover:shadow-md disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none ${btnClass}`}
        aria-label="Previous page"
      >
        <svg className={svgClass} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`font-accent font-bold transition-all cursor-pointer border flex items-center justify-center ${btnClass} ${
            currentPage === page
              ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
              : "bg-white text-secondary border-secondary/10 hover:border-primary hover:text-primary hover:shadow-md"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center border border-secondary/10 bg-white text-secondary transition-all shadow-sm cursor-pointer hover:border-primary hover:text-primary hover:shadow-md disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none ${btnClass}`}
        aria-label="Next page"
      >
        <svg className={svgClass} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
