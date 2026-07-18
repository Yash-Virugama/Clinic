import "./Testimonials.css";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import useTestimonials from "../../hooks/useTestimonials";

const Testimonials = () => {
  const { testimonials, loading } = useTestimonials();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const TESTIMONIALS_PER_PAGE = 10;

  const lastScrolledHashRef = useRef("");
  const sectionRef = useRef(null);
  const location = useLocation();

  // Reset scroll to top immediately on page mount to prevent bottom-up scrolling
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset page to 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Get unique treatment categories dynamically from testimonials
  const categories = [
    "All",
    ...new Set(testimonials.map((t) => t.treatment || "General Rehab")),
  ];

  const filteredTestimonials = selectedCategory === "All"
    ? testimonials
    : testimonials.filter((t) => (t.treatment || "General Rehab") === selectedCategory);

  // Determine current page from hash on initial load or location hash changes
  useEffect(() => {
    if (!loading && filteredTestimonials.length > 0 && location.hash && lastScrolledHashRef.current !== location.hash) {
      const targetId = location.hash.substring(1);
      const targetIdMatch = targetId.match(/^testimonial-(.+)$/);
      if (targetIdMatch) {
        const testimonialId = targetIdMatch[1];
        const index = filteredTestimonials.findIndex((t) => t._id === testimonialId);
        if (index !== -1) {
          const targetPage = Math.floor(index / TESTIMONIALS_PER_PAGE) + 1;
          setCurrentPage(targetPage);
        }
      }
    }
  }, [loading, filteredTestimonials, location.hash]);

  // Scroll to and highlight targeted testimonial from hash when active
  useEffect(() => {
    if (!loading && filteredTestimonials.length > 0 && location.hash && lastScrolledHashRef.current !== location.hash) {
      const targetId = location.hash.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("testimonial-card-highlighted");
          lastScrolledHashRef.current = location.hash;
          setTimeout(() => {
            element.classList.remove("testimonial-card-highlighted");
          }, 8000);
        }, 600); // 600ms to clear the 500ms page entrance animation transition
        return () => clearTimeout(timer);
      }
    }
  }, [loading, filteredTestimonials, currentPage, location.hash]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Instant jump to the top of the page to handle nested scroll wrapper styles
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Smooth scroll into testimonials section as fallback/refinement
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center lg:h-[calc(100vh-80px)] h-[calc(100vh-72px)] min-h-[50vh] bg-bg-offwhite bg-grid-blueprint">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-muted text-sm font-semibold tracking-wide mt-4 font-accent">Loading patient testimonials...</p>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="flex flex-col items-center sm:h-[calc(100vh-80px)] h-[calc(100vh-72px)] justify-center min-h-[55vh] bg-bg-offwhite bg-grid-blueprint text-center p-6">
        <h2 className="text-2xl font-bold text-secondary font-heading mb-2">No Testimonials Available</h2>
        <p className="text-text-muted max-w-sm font-body">No patient reviews have been posted yet. Check back soon or register to share your recovery story.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(filteredTestimonials.length / TESTIMONIALS_PER_PAGE);
  const displayedTestimonials = filteredTestimonials.slice(
    (currentPage - 1) * TESTIMONIALS_PER_PAGE,
    currentPage * TESTIMONIALS_PER_PAGE
  );

  return (
    <section ref={sectionRef} className="relative px-6 lg:px-16 pt-10 sm:pt-15 pb-24 sm:pb-28 bg-bg-offwhite overflow-hidden bg-grid-blueprint min-h-[90vh]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary-glow blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent-glow blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto z-10 relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block text-primary text-xs font-bold tracking-wider uppercase mb-3.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 font-accent animate-pulse">
            Patient Stories
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-bold tracking-tight text-secondary font-heading leading-tight">
            Wall of <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Love</span>
          </h1>
          <p className="text-sm sm:text-base text-text-muted mt-5 font-body leading-relaxed max-w-lg mx-auto">
            Read detailed recovery stories and patient logs. Filter by treatment program to view experiences relevant to your rehabilitation goals.
          </p>
        </div>

        {/* Treatment Category Filter Bar */}
        <div className="max-w-3xl mx-auto overflow-x-auto scrollbar pb-3 mb-12 sm:mb-16">
          <div className="flex justify-center items-center gap-2 min-w-max mx-auto px-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4.5 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-premium cursor-pointer border shrink-0 ${selectedCategory === category
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/15"
                  : "bg-white/60 hover:bg-white text-secondary border-slate-200/80 hover:border-slate-300"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Staggered Timeline Feed Layout of Testimonials */}
        {filteredTestimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-muted text-sm font-semibold font-body">No testimonials found in this category.</p>
          </div>
        ) : (
          <>
            <div className="relative max-w-3xl mx-auto md:pl-28 text-left md:px-0">
              {/* The Vertical Timeline Line (Only on Desktop) */}
              <div className="hidden md:block absolute left-[40px] top-4 bottom-4 w-[2px] bg-slate-200/80 z-0 pointer-events-none" />

              <div className="flex flex-col gap-12 sm:gap-16 relative z-10">
                {displayedTestimonials.map((testimonial) => {
                  const rating = testimonial.rating || 5;
                  const avatarUrl = testimonial.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.patientName)}&background=random&color=fff`;

                  return (
                    <div
                      key={testimonial._id}
                      id={`testimonial-${testimonial._id}`}
                      className="flex flex-col md:flex-row gap-5 md:gap-8 items-start relative group w-full"
                    >
                      {/* Mobile-only Header Row (Side-by-side Avatar & Info) */}
                      <div className="flex items-center gap-4 w-full md:hidden">
                        <div className="relative shrink-0">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-md bg-white ring-4 ring-primary/10">
                            {testimonial.user?.image ? (
                              <img
                                src={testimonial.user.image}
                                alt={testimonial.patientName}
                                className="w-full h-full object-cover rounded-2xl"
                              />
                            ) : (
                              <div className="w-full h-full bg-primary/10 rounded-2xl flex items-center justify-center font-bold text-lg sm:text-2xl text-primary uppercase font-heading">
                                {testimonial.user?.name?.charAt(0) || "❓"}
                              </div>
                            )}
                          </div>
                          {/* Rating Overlay */}
                          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow flex items-center gap-0.5 border border-white">
                            <span>{rating}</span>
                            <svg className="w-2 h-2 fill-currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-extrabold text-base text-secondary font-heading leading-tight group-hover:text-primary transition-colors duration-300">
                            {testimonial.patientName}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-[9px] font-bold text-primary uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                              {testimonial.treatment || "General Rehab"}
                            </span>
                            <div className="flex items-center gap-0.5 text-emerald-600 text-[9px] font-bold tracking-wider uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              Verified
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop-only Timeline Node (Large Avatar Frame on left side) */}
                      <div className="hidden md:block relative z-10 shrink-0">
                        <div className="relative w-20 h-20 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all duration-500 transform group-hover:scale-103 group-hover:rotate-2">
                          {testimonial.user?.image ? (
                            <img
                              src={testimonial.user.image}
                              alt={testimonial.patientName}
                              className="w-full h-full object-cover rounded-2xl"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary/10 rounded-2xl flex items-center justify-center font-bold text-md sm:text-2xl text-primary uppercase font-heading">
                              {testimonial.user?.name?.charAt(0) || "❓"}
                            </div>
                          )}
                        </div>

                        {/* Rating Stars Overlay Badge */}
                        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-full shadow-lg flex items-center gap-0.5 shrink-0 z-20 border border-white">
                          <span>{rating}</span>
                          <svg className="w-2.5 h-2.5 fill-currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </div>

                      {/* Timeline Content Block (Borderless, Text-Only) */}
                      <div className="flex flex-col gap-2 flex-1 w-full p-4 pr-0 sm:p-4 -m-4 rounded-2xl group-hover:bg-primary/[0.02] transition-all duration-300">
                        {/* Desktop-only Header Row */}
                        <div className="hidden md:flex flex-wrap items-center gap-x-2.5 gap-y-1">
                          <h4 className="font-extrabold text-lg text-secondary font-heading tracking-tight leading-none group-hover:text-primary transition-colors duration-300">
                            {testimonial.patientName}
                          </h4>
                          <span className="text-[11px] font-bold text-primary uppercase tracking-wider px-2.5 py-0.5 rounded bg-primary/5 border border-primary/10">
                            {testimonial.treatment || "General Rehab"}
                          </span>
                          <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <svg className="w-2.5 h-2.5 stroke-[3.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Verified Outcome
                          </div>
                        </div>

                        {/* Stars for visual layout (Desktop only) */}
                        <div className="hidden md:flex gap-0.5 text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3.5 h-3.5 ${i < rating ? "fill-currentColor" : "stroke-current stroke-1 fill-none"}`}
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>

                        {/* Quote Text (Full width on mobile, left-border indented) */}
                        <blockquote className="text-secondary font-body italic text-sm sm:text-base leading-relaxed mt-1 text-slate-700 w-full border-l-2 border-slate-200/80 group-hover:border-primary/40 pl-4 py-0.5 transition-colors duration-300">
                          "{testimonial.content}"
                        </blockquote>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16 sm:mt-24">
                {/* Prev Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center w-11 h-11 rounded-xl border border-secondary/10 bg-white text-secondary transition-premium shadow-sm cursor-pointer hover:border-primary hover:text-primary hover:shadow-md disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none"
                  aria-label="Previous page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-11 h-11 font-accent font-bold text-sm rounded-xl transition-premium cursor-pointer border flex items-center justify-center ${currentPage === page
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                      : "bg-white text-secondary border-secondary/10 hover:border-primary hover:text-primary hover:shadow-md"
                      }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center w-11 h-11 rounded-xl border border-secondary/10 bg-white text-secondary transition-premium shadow-sm cursor-pointer hover:border-primary hover:text-primary hover:shadow-md disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none"
                  aria-label="Next page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Testimonials;