import "./Resources.css";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import useResources from "../../hooks/useResources";
import { useAuth } from "../../context/AuthContext";

// Helper to determine file format dynamically from original filename or URL
const getFileFormat = (url, fileName) => {
  let ext = "";
  if (fileName) {
    ext = fileName.split(".").pop().split(/[?#]/)[0].toUpperCase();
  }
  if (!ext && url) {
    ext = url.split(".").pop().split(/[?#]/)[0].toUpperCase();
  }
  if (!ext) return "PDF";
  return ["PDF", "PNG", "JPG", "JPEG", "DOC", "DOCX", "XLS", "XLSX", "TXT"].includes(ext) ? ext : "PDF";
};

// Color code formatting badges based on file format
const getFormatBadgeStyle = (format) => {
  switch (format) {
    case "PDF":
      return "bg-rose-500/10 text-rose-400 border-rose-500/25";
    case "DOC":
    case "DOCX":
      return "bg-blue-500/10 text-blue-400 border-blue-500/25";
    case "XLS":
    case "XLSX":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
    case "PNG":
    case "JPG":
    case "JPEG":
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/25";
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/25";
  }
};

// Add background glows matching file formats
const getFormatGlow = (format) => {
  switch (format) {
    case "PDF":
      return "from-rose-500/10 via-rose-500/2 to-transparent";
    case "DOC":
    case "DOCX":
      return "from-blue-500/10 via-blue-500/2 to-transparent";
    case "XLS":
    case "XLSX":
      return "from-emerald-500/10 via-emerald-500/2 to-transparent";
    case "PNG":
    case "JPG":
    case "JPEG":
      return "from-indigo-500/10 via-indigo-500/2 to-transparent";
    default:
      return "from-slate-500/10 via-slate-500/2 to-transparent";
  }
};

// Add dynamic buttons matching format accent colors
const getFormatButtonClass = (format, isDownloading) => {
  if (isDownloading) {
    return "bg-slate-900 text-slate-500 border-slate-850 cursor-wait";
  }
  switch (format) {
    case "PDF":
      return "bg-rose-600 hover:bg-rose-500 border-rose-600 shadow-rose-950/20 hover:shadow-rose-600/35 text-white hover:scale-[1.01]";
    case "DOC":
    case "DOCX":
      return "bg-blue-600 hover:bg-blue-500 border-blue-600 shadow-blue-950/20 hover:shadow-blue-600/35 text-white hover:scale-[1.01]";
    case "XLS":
    case "XLSX":
      return "bg-emerald-600 hover:bg-emerald-500 border-emerald-600 shadow-emerald-950/20 hover:shadow-emerald-600/35 text-white hover:scale-[1.01]";
    case "PNG":
    case "JPG":
    case "JPEG":
      return "bg-indigo-600 hover:bg-indigo-500 border-indigo-600 shadow-indigo-950/20 hover:shadow-indigo-600/35 text-white hover:scale-[1.01]";
  }
};

// Add dynamic hovered text colors matching format accent colors
const getFormatTextColorClass = (format) => {
  switch (format) {
    case "PDF":
      return "group-hover:text-rose-400";
    case "DOC":
    case "DOCX":
      return "group-hover:text-blue-400";
    case "XLS":
    case "XLSX":
      return "group-hover:text-emerald-400";
    case "PNG":
    case "JPG":
    case "JPEG":
      return "group-hover:text-indigo-400";
    default:
      return "group-hover:text-primary";
  }
};

// Specialized SVG icons representing each category
const getCategoryIcon = (category) => {
  switch (category) {
    case "Exercise":
      return (
        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case "Posture":
      return (
        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      );
    case "Stretching":
      return (
        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707" />
        </svg>
      );
    case "Rehabilitation":
      return (
        <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case "Nutrition":
      return (
        <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
  }
};

// Google Drive-style simulated document preview component
const DocumentPreviewThumbnail = ({ format, title }) => {
  let headerBg = "bg-slate-600";
  let label = format;

  if (format === "PDF") {
    headerBg = "bg-rose-500";
  } else if (format === "DOC" || format === "DOCX") {
    headerBg = "bg-blue-500";
    label = "DOCX";
  } else if (format === "XLS" || format === "XLSX") {
    headerBg = "bg-emerald-500";
    label = "XLSX";
  } else if (["PNG", "JPG", "JPEG"].includes(format)) {
    headerBg = "bg-indigo-500";
    label = "IMAGE";
  }

  const renderSimulatedBody = () => {
    if (format === "PDF") {
      return (
        <div className="p-3 flex flex-col gap-1.5 flex-1 justify-start overflow-hidden text-left bg-white">
          {/* Simulated Document Title */}
          <div className="h-1.5 bg-slate-200 rounded w-10/12 mb-2 mt-0.5 shrink-0" />

          {/* Simulated Checked Checklist Rows */}
          <div className="flex flex-col gap-1 mb-1 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="simulated-checklist-box">
                <svg className="simulated-checklist-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div className="h-1 bg-slate-100 rounded w-8/12" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="simulated-checklist-box">
                <svg className="simulated-checklist-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div className="h-1 bg-slate-100 rounded w-9/12" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="simulated-checklist-box" />
              <div className="h-1 bg-slate-100 rounded w-6/12" />
            </div>
          </div>

          {/* Spine Vertebrae Blueprint Sketch Overlay */}
          <div className="flex-1 border border-dashed border-slate-200 rounded-lg flex items-center justify-center bg-slate-50/50 my-1 relative overflow-hidden py-1 min-h-[44px]">
            <svg className="w-7 h-7 text-primary/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2v20M9 5h6M8 9h8M7 13h10M8 17h8M9 20h6" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      );
    }
    if (format === "DOC" || format === "DOCX") {
      return (
        <div className="p-3 flex flex-col gap-1.5 flex-1 justify-start overflow-hidden text-left bg-white">
          <div className="h-1.5 bg-slate-200 rounded w-9/12 mb-2 mt-0.5 shrink-0" />
          <div className="flex flex-col gap-1.5 mt-2 flex-1 justify-start">
            <div className="h-1 bg-slate-100 rounded w-full" />
            <div className="h-1 bg-slate-100 rounded w-11/12" />
            <div className="h-1 bg-slate-100 rounded w-full" />
            <div className="h-1 bg-slate-100 rounded w-10/12" />
            <div className="h-1 bg-slate-100 rounded w-8/12" />
            <div className="h-1 bg-slate-100 rounded w-9/12" />
          </div>
        </div>
      );
    }
    if (format === "XLS" || format === "XLSX") {
      return (
        <div className="p-2.5 flex-1 flex flex-col gap-1.5 overflow-hidden bg-white">
          <div className="h-1.5 bg-slate-200 rounded w-7/12 mb-2 mt-0.5 shrink-0" />
          <div className="flex-1 border border-slate-100 rounded overflow-hidden flex flex-col mt-1">
            <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-100 shrink-0">
              <div className="h-3 border-r border-slate-100 bg-slate-150" />
              <div className="h-3 border-r border-slate-100" />
              <div className="h-3 border-r border-slate-100" />
              <div className="h-3" />
            </div>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="grid grid-cols-4 border-b border-slate-100 flex-1">
                <div className="border-r border-slate-100 bg-emerald-50/15" />
                <div className="border-r border-slate-100" />
                <div className="border-r border-slate-100" />
                <div className="bg-slate-50/10" />
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (["PNG", "JPG", "JPEG"].includes(format)) {
      return (
        <div className="p-3 flex-1 flex flex-col justify-between overflow-hidden bg-white">
          <div className="h-1.5 bg-slate-200 rounded w-8/12 mb-2 mt-0.5 shrink-0" />
          <div className="flex-1 bg-slate-50 border border-slate-150 rounded-lg flex items-center justify-center overflow-hidden relative min-h-[44px]">
            <svg className="w-8 h-8 text-indigo-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      );
    }
    return (
      <div className="p-3 flex flex-col gap-1.5 flex-1 items-center justify-center text-center bg-white">
        <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="text-[8px] text-text-muted font-medium">Generic File</span>
      </div>
    );
  };

  return (
    <div className="w-full aspect-[16/10.5] sm:aspect-[16/11.5] bg-[#05070f] border border-slate-900/80 rounded-2xl flex items-center justify-center p-3 relative overflow-hidden group-hover:bg-[#070a16] transition-colors duration-300 mb-5 select-none shadow-inner">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="w-[72%] h-[90%] bg-white rounded-lg border border-slate-200/80 overflow-hidden flex flex-col relative resource-preview-card shadow-sm">
        <div className={`h-6 ${headerBg} flex items-center justify-between px-3 shrink-0 border-b border-black/5`}>
          <span className="text-[9px] text-white font-extrabold tracking-widest leading-none mt-0.5">{label}</span>
          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
        </div>
        {renderSimulatedBody()}
      </div>
    </div>
  );
};

const Resources = () => {
  const { user } = useAuth();
  const { resources, loading } = useResources();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadingIds, setDownloadingIds] = useState({});
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

  // Localized download function
  const handleDownload = async (resource) => {
    if (downloadingIds[resource._id]) return;
    setDownloadingIds((prev) => ({ ...prev, [resource._id]: true }));
    try {
      const response = await fetch(resource.fileUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = resource.fileName || `${resource.title.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed, falling back to direct link", error);
      window.open(resource.fileUrl, "_blank");
    } finally {
      setDownloadingIds((prev) => ({ ...prev, [resource._id]: false }));
    }
  };

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
      <div className="flex flex-col items-center justify-center lg:h-[calc(100vh-80px)] h-[calc(100vh-72px)] min-h-[50vh] bg-bg-offwhite bg-grid-blueprint">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-muted text-sm font-semibold tracking-wide mt-4 font-accent">Loading publication vault...</p>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center sm:h-[calc(100vh-80px)] h-[calc(100vh-72px)] min-h-[55vh] bg-bg-offwhite bg-grid-blueprint text-center p-6">
        <h2 className="text-2xl font-bold text-secondary font-heading mb-2">No Resources Available</h2>
        <p className="text-text-muted max-w-sm font-body">No medical files or exercise sheets are currently listed. Please contact clinic administration.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="login-require flex flex-col items-center justify-center sm:h-[calc(100vh-80px)] h-[calc(100vh-72px)] bg-bg-offwhite bg-grid-blueprint text-center p-6">
        <h2 className="text-2xl font-bold text-secondary font-heading mb-2">Login Require</h2>
        <p className="text-text-muted max-w-sm font-body">Please login to access resources.</p>
      </div>
    )
  }

  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);
  const displayedResources = filteredResources.slice(
    (currentPage - 1) * resourcesPerPage,
    currentPage * resourcesPerPage
  );

  return (
    <section ref={sectionRef} className="relative px-6 lg:px-16 pt-10 sm:pt-15 pb-24 sm:pb-28 bg-bg-offwhite overflow-hidden bg-grid-blueprint min-h-[90vh]">
      {/* Ambient background lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary-glow blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent-glow blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto z-10 relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-primary text-xs font-bold tracking-wider uppercase mb-3.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 font-accent animate-pulse">
            Patient Downloads
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-bold tracking-tight text-secondary font-heading leading-tight">
            Rehab <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Vault</span>
          </h1>
          <p className="text-sm sm:text-base text-text-muted mt-5 font-body leading-relaxed max-w-lg mx-auto">
            Access, view, and download clinical guidelines, stretching checklists, postural logs, and nutritional sheets.
          </p>
        </div>

        {/* Search & Category Filter Actions Panel */}
        <div className="max-w-3xl mx-auto mb-10 sm:mb-16 flex flex-col gap-6">
          {/* Dynamic Keyword Search Bar */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search rehabilitation guidelines and vault documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pl-12 rounded-full border border-slate-200/80 bg-white/70 backdrop-blur-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
            />
            <div className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-secondary text-xs font-bold uppercase tracking-wider font-accent cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

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
              {displayedResources.map((res) => {
                const format = getFileFormat(res.fileUrl, res.fileName);
                const formatStyle = getFormatBadgeStyle(format);
                const isDownloading = !!downloadingIds[res._id];

                return (
                  <div
                    key={res._id}
                    className="bg-gradient-to-b from-[#0f172a] to-[#0b1329] border border-slate-800 rounded-[28px] p-5.5 hover:border-slate-700/85 hover:shadow-2xl hover:shadow-primary/5 transition-premium group relative flex flex-col justify-between min-h-[450px] text-left overflow-hidden"
                  >
                    {/* Format-Specific Corner Glow Overlay */}
                    <div className={`absolute -top-16 -right-16 w-36 h-36 rounded-full bg-gradient-to-br ${getFormatGlow(format)} blur-2xl opacity-40 group-hover:opacity-85 transition-opacity duration-500 pointer-events-none z-0`} />

                    <div className="relative z-10">
                      {/* Visual Google Drive Preview Thumbnail */}
                      <DocumentPreviewThumbnail format={format} title={res.title} />

                      {/* Metadata Header */}
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          {/* Admin profile picture avatar frame */}
                          <div className="w-8 h-8 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                            {res.author?.image ? (
                              <img
                                src={res.author.image}
                                alt={res.author.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-primary/20 flex items-center justify-center font-bold text-[10px] text-primary uppercase font-heading">
                                {res.author?.name?.charAt(0) || "A"}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-[10px] font-extrabold text-slate-200 leading-tight">
                              {res.author?.name || "Admin"}
                            </span>
                            <span className="text-[8px] font-bold text-slate-350 uppercase tracking-widest mt-0.5">
                              {res.category}
                            </span>
                          </div>
                        </div>
                        <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${formatStyle}`}>
                          {format}
                        </span>
                      </div>

                      <h3 className={`font-extrabold text-base text-slate-100 font-heading ${getFormatTextColorClass(format)} transition-colors duration-300 leading-snug mb-2`}>
                        {res.title}
                      </h3>
                      <p className="text-xs text-slate-300/90 font-body leading-relaxed mb-6 line-clamp-2">
                        {res.description}
                      </p>
                    </div>

                    {/* Downloader Action Row */}
                    <div className="relative z-10">
                      {res.fileUrl ? (
                        <button
                          onClick={() => handleDownload(res)}
                          disabled={isDownloading}
                          style={{ cursor: isDownloading ? "wait" : "pointer" }}
                          className={`w-full py-3.5 px-5 rounded-full flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-wider transition-premium cursor-pointer border ${getFormatButtonClass(format, isDownloading)}`}
                        >
                          {isDownloading ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                              </svg>
                              Download Resource
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="text-[10px] text-center text-red-500 font-bold uppercase tracking-widest bg-red-50 py-2 rounded-xl border border-red-100">
                          File Unavailable
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16">
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
                    className={`w-11 h-11 font-accent font-bold text-sm rounded-xl transition-premium cursor-pointer border flex items-center justify-center ${
                      currentPage === page
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