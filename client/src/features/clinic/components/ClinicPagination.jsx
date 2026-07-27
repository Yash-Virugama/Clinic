const ClinicPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-11 h-11 rounded-xl border border-secondary/10 bg-white text-secondary transition-premium shadow-sm cursor-pointer hover:border-primary hover:text-primary hover:shadow-md disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none"
        aria-label="Previous page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-11 h-11 font-accent font-bold text-sm rounded-xl transition-premium cursor-pointer border flex items-center justify-center ${
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
        className="flex items-center justify-center w-11 h-11 rounded-xl border border-secondary/10 bg-white text-secondary transition-premium shadow-sm cursor-pointer hover:border-primary hover:text-primary hover:shadow-md disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none"
        aria-label="Next page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default ClinicPagination;
