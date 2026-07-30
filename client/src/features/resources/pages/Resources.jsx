import "./Resources.css";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import useResources from "../hooks/useResources";
import { useAuth } from "../../../context/AuthContext";
import Spinner from "../../../components/ui/Spinner";
import EmptyState from "../../../components/ui/EmptyState";
import BackgroundGlows from "../../../components/ui/BackgroundGlows";
import PageHeader from "../../../components/ui/PageHeader";
import Pagination from "../../../components/ui/Pagination";
import Searchbar from "../../../components/ui/Searchbar";
import ResourceCard from "../components/ResourceCard";

const Resources = () => {
  const { user } = useAuth();
  const { resources, loading } = useResources();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [resourcesPerPage, setResourcesPerPage] = useState(
    window.innerWidth < 768 ? 5 : 6
  );

  const sectionRef = useRef(null);

  // Scroll to top immediately on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle dynamic screen width page sizing
  useEffect(() => {
    const handleResize = () => {
      setResourcesPerPage(window.innerWidth < 768 ? 5 : 6);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get unique categories dynamically
  const categories = [
    "All",
    ...new Set(resources.map((r) => r.category || "General")),
  ];

  // Apply filters
  const filteredResources = resources.filter((res) => {
    const matchesCategory = selectedCategory === "All" || (res.category || "General") === selectedCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Clamp current page to total pages if resizing or filtering makes it invalid
  useEffect(() => {
    const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [resourcesPerPage, filteredResources.length, currentPage]);

  // Reset page to 1 on filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Instant jump to the top of the page to handle nested scroll wrapper styles
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Smooth scroll into resources section as fallback/refinement
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center lg:h-[calc(100vh-80px)] h-[calc(100vh-72px)] min-h-[50vh] bg-bg-offwhite bg-grid-blueprint">
        <Spinner text="Loading publication vault..." />
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="flex items-center justify-center sm:h-[calc(100vh-80px)] h-[calc(100vh-72px)] bg-bg-offwhite bg-grid-blueprint">
        <EmptyState
          title="No Resources Available"
          description="No medical files or exercise sheets are currently listed. Please contact clinic administration."
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="login-require flex flex-col items-center justify-center sm:h-[calc(100vh-80px)] h-[calc(100vh-72px)] bg-bg-offwhite bg-grid-blueprint text-center p-6">
        <h2 className="text-2xl font-bold text-secondary font-heading mb-2">Login Require</h2>
        <p className="text-text-muted max-w-sm font-body">Please login to access resources.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);
  const displayedResources = filteredResources.slice(
    (currentPage - 1) * resourcesPerPage,
    currentPage * resourcesPerPage
  );

  return (
    <section ref={sectionRef} className="relative px-6 lg:px-16 pt-10 sm:pt-15 pb-24 sm:pb-28 bg-bg-offwhite overflow-hidden bg-grid-blueprint min-h-[90vh]">
      {/* Ambient background lighting */}
      <BackgroundGlows />

      <div className="max-w-7xl mx-auto z-10 relative">
        {/* Header */}
        <PageHeader
          badge="Patient Downloads"
          title="Rehab"
          highlightWord="Vault"
          description="Access, view, and download clinical guidelines, stretching checklists, postural logs, and nutritional sheets."
        />

        {/* Search & Category Filter Actions Panel */}
        <div className="max-w-3xl mx-auto mb-10 sm:mb-16 flex flex-col gap-6">
          {/* Dynamic Keyword Search Bar */}
          <Searchbar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search rehabilitation guidelines and vault documents..."
            className="w-full"
          />

          {/* Dynamic Category Filters with center/scroll-x wrapper */}
          <div className="w-full overflow-x-auto scrollbar-thin pb-3">
            <div className="flex justify-center items-center gap-2 min-w-max mx-auto px-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase transition-premium cursor-pointer border shrink-0 ${selectedCategory === cat
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/15"
                      : "bg-white/60 hover:bg-white text-secondary border-slate-200/80 hover:border-slate-300"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Document Tiles Grid */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-12 bg-white/30 border border-slate-200/50 rounded-3xl p-8 max-w-lg mx-auto">
            <p className="text-text-muted text-sm font-semibold font-body">No clinical files match your criteria. Try adjusting your search query.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedResources.map((res) => (
                <ResourceCard key={res._id} resource={res} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {/* 3. Custom Guidelines Request Card (Adds unique clinical interaction) */}
        <div className="mt-20 sm:mt-24 max-w-4xl mx-auto bg-white border border-slate-200/60 p-8 sm:p-12 rounded-[32px] hover:border-primary/20 shadow-xl sm:shadow-lg hover:shadow-2xl transition-premium relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-12">
          {/* Custom Spine outline backdrop sketch */}
          <div className="absolute inset-0 bg-grid-blueprint opacity-[0.03] pointer-events-none" />

          <div className="max-w-md">
            <span className="inline-block text-primary text-[10px] font-extrabold tracking-widest uppercase mb-3">
              specialist support vault
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-secondary font-heading leading-tight mb-3">
              Need a Customized Rehab Plan?
            </h3>
            <p className="text-xs sm:text-sm text-text-muted font-body leading-relaxed">
              If you have specific injury constraints, chronic pain, or require a tailored set of home exercises, request a custom PDF directory.
            </p>
          </div>

          <Link
            to="/contact"
            className="px-6 py-4 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary-hover shadow-md hover:shadow-primary/10 transition-premium cursor-pointer shrink-0"
          >
            Request custom plan
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Resources;