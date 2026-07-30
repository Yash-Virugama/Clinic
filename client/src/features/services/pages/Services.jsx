import "./Services.css";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import useServices from "../hooks/useServices";
import Spinner from "../../../components/ui/Spinner";
import EmptyState from "../../../components/ui/EmptyState";
import BackgroundGlows from "../../../components/ui/BackgroundGlows";
import PageHeader from "../../../components/ui/PageHeader";
import Pagination from "../../../components/ui/Pagination";

const Services = () => {
  const { services, loading } = useServices();
  const [currentPage, setCurrentPage] = useState(1);
  const SERVICES_PER_PAGE = 5;

  const lastScrolledHashRef = useRef("");
  const sectionRef = useRef(null);
  const location = useLocation();

  // Reset scroll to top immediately on page mount to prevent bottom-up scrolling
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Determine current page from hash on initial load or location hash changes
  useEffect(() => {
    if (!loading && services.length > 0 && location.hash && lastScrolledHashRef.current !== location.hash) {
      const targetId = location.hash.substring(1);
      const targetIdMatch = targetId.match(/^service-(.+)$/);
      if (targetIdMatch) {
        const serviceId = targetIdMatch[1];
        const index = services.findIndex((s) => s._id === serviceId);
        if (index !== -1) {
          const targetPage = Math.floor(index / SERVICES_PER_PAGE) + 1;
          setCurrentPage(targetPage);
        }
      }
    }
  }, [loading, services, location.hash]);

  // Scroll to and highlight targeted service from hash when active
  useEffect(() => {
    if (!loading && services.length > 0 && location.hash && lastScrolledHashRef.current !== location.hash) {
      const targetId = location.hash.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("service-section-highlighted");
          lastScrolledHashRef.current = location.hash; // Mark as scrolled ONLY when scroll executes
          setTimeout(() => {
            element.classList.remove("service-section-highlighted");
          }, 3500);
        }, 600); // 600ms to clear the 500ms page entrance animation transition
        return () => clearTimeout(timer);
      }
    }
  }, [loading, services, currentPage, location.hash]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Instant jump to the top of the page to handle nested scroll wrapper styles
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Smooth scroll into services section as fallback/refinement
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Calculate reading time helper
  const getReadingTime = (content) => {
    const words = content ? content.split(/\s+/).length : 0;
    const minutes = Math.ceil(words / 220); // 220 words per min avg
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center lg:h-[calc(100vh-80px)] h-[calc(100vh-72px)] min-h-[50vh] bg-bg-offwhite bg-grid-blueprint">
        <Spinner text="Loading clinical services..." />
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="flex items-center justify-center sm:h-[calc(100vh-80px)] h-[calc(100vh-72px)] bg-bg-offwhite bg-grid-blueprint">
        <EmptyState
          title="No Services Available"
          description="Our treatment services catalog is currently empty. Please check back later or contact us directly."
        />
      </div>
    );
  }

  const totalPages = Math.ceil(services.length / SERVICES_PER_PAGE);
  const displayedServices = services.slice(
    (currentPage - 1) * SERVICES_PER_PAGE,
    currentPage * SERVICES_PER_PAGE
  );

  return (
    <section ref={sectionRef} className="relative px-6 lg:px-16 pt-10 sm:pt-15 pb-24 sm:pb-28 bg-bg-offwhite overflow-hidden bg-grid-blueprint min-h-[90vh]">
      {/* Background ambient lighting */}
      <BackgroundGlows />

      <div className="max-w-7xl mx-auto z-10 relative">
        {/* Header */}
        <PageHeader
          badge="Clinical Programs"
          title="Our Recovery"
          highlightWord="Services"
          description="Explore our specialized, evidence-based physiotherapy regimens designed to restore functional movement, relieve chronic pain, and improve your overall strength."
        />

        {/* Detailed Services Alternating Layout */}
        <div className="flex flex-col gap-20 lg:gap-28 mt-16 max-w-6xl mx-auto">
          {displayedServices.map((service, idx) => {
            const globalIdx = (currentPage - 1) * SERVICES_PER_PAGE + idx;
            const isEven = globalIdx % 2 === 0;
            const serviceNumber = String(globalIdx + 1).padStart(2, "0");

            return (
              <div
                key={service._id}
                id={`service-${service._id}`}
                className="flow-root transition-all duration-1000 p-2 sm:p-5 rounded-[32px]"
              >
                {/* Image Column */}
                <div className={`w-full lg:w-[50%] relative mb-6 lg:mb-4 ${isEven ? "lg:float-right lg:ml-12" : "lg:float-left lg:mr-12"}`}>
                  {/* Decorative blueprint grids & glows */}
                  <div className="absolute inset-0 bg-dot-matrix opacity-25 rounded-[32px] pointer-events-none" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent opacity-10 blur-xl rounded-[32px] pointer-events-none" />

                  <div className="relative w-full aspect-video rounded-3.5xl overflow-hidden border border-secondary/10 shadow-lg bg-slate-100">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-text-muted italic bg-slate-50">
                        No Clinical Image Available
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Column */}
                <div className="text-left">
                  {/* Order Badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-primary font-accent font-bold text-lg">{serviceNumber}</span>
                    <span className="h-[1px] w-8 bg-primary/30" />
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Clinical Program</span>
                  </div>

                  {/* Service Title */}
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-secondary font-heading tracking-tight leading-tight mb-2">
                    {service.title}
                  </h2>

                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-text-muted font-accent uppercase tracking-wider">
                      {getReadingTime(service.description)}
                    </span>
                  </div>

                  {/* Service Description (formatted with paragraphs) */}
                  <div className="text-slate-600 font-body text-sm sm:text-base leading-relaxed mb-6">
                    {service.description.split(/\n+/).map((para, pIdx) => (
                      <p key={pIdx} className="mb-4">{para.trim()}</p>
                    ))}
                  </div>

                  {/* Call To Action */}
                  <div>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl text-sm transition-premium shadow-md shadow-secondary/10 cursor-pointer"
                    >
                      Book Consultation
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
};

export default Services;