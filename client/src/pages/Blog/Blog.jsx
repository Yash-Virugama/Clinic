import "./Blog.css";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import useBlogs from "../../hooks/useBlogs";
import { useBranding } from "../../context/BrandingContext";

const Blog = () => {

  const { settings } = useBranding();
  const { blogs, loading } = useBlogs();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const BLOGS_PER_PAGE = 4;

  const sectionRef = useRef(null);

  // Scroll to top immediately on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get unique categories dynamically from all blogs
  const categories = [
    "All",
    ...new Set(blogs.map((b) => b.category || "General")),
  ];

  // Apply search query and category filters
  const filteredBlogs = blogs.filter((b) => {
    const matchesCategory = selectedCategory === "All" || (b.category || "General") === selectedCategory;
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Clamp current page to total pages if filtering/searching makes it invalid
  useEffect(() => {
    const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredBlogs.length, currentPage]);

  // Reset page to 1 on filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE);
  const displayedBlogs = filteredBlogs.slice(
    (currentPage - 1) * BLOGS_PER_PAGE,
    currentPage * BLOGS_PER_PAGE
  );

  // Identify featured article (only on initial "All" view with empty search on PAGE 1)
  const showFeatured = selectedCategory === "All" && searchQuery === "" && currentPage === 1 && displayedBlogs.length > 0;
  const featuredBlog = showFeatured ? displayedBlogs[0] : null;
  const gridBlogs = showFeatured ? displayedBlogs.slice(1) : displayedBlogs;

  // Calculate reading time helper
  const getReadingTime = (content) => {
    const words = content ? content.split(/\s+/).length : 0;
    const minutes = Math.ceil(words / 220); // 220 words per min avg
    return `${minutes} min read`;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Instant jump to the top of the page
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Smooth scroll into blogs section as fallback
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center lg:h-[calc(100vh-80px)] h-[calc(100vh-72px)] min-h-[50vh] bg-bg-offwhite bg-grid-blueprint">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-muted text-sm font-semibold tracking-wide mt-4 font-accent">Loading medical library...</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center sm:h-[calc(100vh-80px)] h-[calc(100vh-72px)] min-h-[55vh] bg-bg-offwhite bg-grid-blueprint text-center p-6">
        <h2 className="text-2xl font-bold text-secondary font-heading mb-2">No Articles Available</h2>
        <p className="text-text-muted max-w-sm font-body">No health articles have been published yet. Please check back soon for clinical insights.</p>
      </div>
    );
  }

  // Reusable Grid Blueprint Cover Fallback
  const CoverFallback = ({ category }) => (
    <div className="w-full h-full bg-darkblue bg-grid-blueprint-dark flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/25 via-transparent to-accent/15 pointer-events-none" />
      <span className="text-white/80 font-bold text-xs uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full border border-white/10 relative z-10 font-accent backdrop-blur-sm">
        {category}
      </span>
      <span className="text-[0.6rem] sm:text-[1rem] text-white/40 font-bold uppercase tracking-wider mt-3.5 relative z-10 font-body">
        {settings?.name || ""} Clinical Publication
      </span>
    </div>
  );

  return (
    <section ref={sectionRef} className="relative px-6 lg:px-16 pt-10 sm:pt-15 pb-24 sm:pb-28 bg-bg-offwhite overflow-hidden bg-grid-blueprint min-h-[90vh]">
      {/* Ambient backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary-glow blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent-glow blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto z-10 relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-primary text-xs font-bold tracking-wider uppercase mb-3.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 font-accent animate-pulse">
            Health Library
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-bold tracking-tight text-secondary font-heading leading-tight">
            Clinical <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Insights</span>
          </h1>
          <p className="text-sm sm:text-base text-text-muted mt-5 font-body leading-relaxed max-w-lg mx-auto">
            Read clinical insights, wellness guidance, and injury prevention guides researched and written by our clinical specialists.
          </p>
        </div>

        {/* Search & Category Filter Actions Panel */}
        <div className="max-w-3xl mx-auto mb-12 sm:mb-16 flex flex-col gap-6">
          {/* Dynamic Keyword Search Bar */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search health library articles..."
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

          {/* Dynamic Category Filters */}
          <div className="w-full overflow-x-auto scrollbar-thin pb-3">
            <div className="flex justify-center items-center gap-2 min-w-max mx-auto px-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4.5 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-premium cursor-pointer border shrink-0 ${selectedCategory === cat
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

        {/* 1. Featured Article Header Row (Only on initial "All" view with empty search on PAGE 1) */}
        {showFeatured && featuredBlog && (
          <div className="mb-8 sm:mb-20">
            <Link
              to={`/blog/${featuredBlog.slug}`}
              className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 bg-white/40 border border-slate-200/60 p-4 sm:p-6 sm:p-8 rounded-[32px] hover:border-primary/20 hover:shadow-2xl transition-premium group relative overflow-hidden"
            >
              {/* Cover Image (Reduced width to 48% on desktop for balanced proportions) */}
              <div className="w-full lg:w-[48%] aspect-video rounded-2xl sm:rounded-[24px] overflow-hidden shrink-0 shadow-md relative">
                {featuredBlog.coverImage ? (
                  <img
                    src={featuredBlog.coverImage}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                  />
                ) : (
                  <CoverFallback category={featuredBlog.category} />
                )}
                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow border border-white/10 uppercase tracking-wider">
                  Featured
                </div>
              </div>

              {/* Meta details */}
              <div className="flex flex-col justify-between py-2 flex-1 text-left">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider bg-primary/15 px-3 py-1 rounded-full border border-primary/20">
                      {featuredBlog.category}
                    </span>
                    <span className="text-[10px] font-bold text-text-muted font-accent uppercase tracking-wider">
                      {getReadingTime(featuredBlog.content)}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-secondary font-heading group-hover:text-primary transition-colors duration-300 leading-tight mb-4">
                    {featuredBlog.title}
                  </h2>

                  <p className="text-sm sm:text-base text-text-muted font-body leading-relaxed mb-6">
                    {featuredBlog.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-100 mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0 bg-slate-50">
                      {featuredBlog.author?.image ? (
                        <img
                          src={featuredBlog.author.image}
                          alt={featuredBlog.author.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary uppercase font-heading">
                          {featuredBlog.author?.name?.charAt(0) || "A"}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-secondary leading-tight">{featuredBlog.author?.name || "Clinic Writer"}</h4>
                      <p className="text-[9px] sm:text-[10px] text-text-muted font-medium uppercase tracking-wider mt-0.5">
                        {new Date(featuredBlog.publishedAt || featuredBlog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider font-accent group-hover:translate-x-1.5 transition-transform duration-300">
                    Read Article
                    <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* 2. Grid Articles */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12 bg-white/30 border border-slate-200/50 rounded-3xl p-8 max-w-lg mx-auto">
            <p className="text-text-muted text-sm font-semibold font-body">No health articles match your search or filter criteria. Try resetting the filters.</p>
          </div>
        ) : (
          <>
            {gridBlogs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                {gridBlogs.map((blog) => {
                  const readingTime = getReadingTime(blog.content);
                  const authorInitials = blog.author?.name?.charAt(0) || "P";
                  const publishDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

                  return (
                    <article
                      key={blog._id}
                      className="bg-white/40 border border-slate-200/60 rounded-3xl p-4 sm:p-6.5 hover:border-primary/20 hover:shadow-xl transition-premium group relative flex flex-col justify-between min-h-[440px] text-left"
                    >
                      <Link to={`/blog/${blog.slug}`} className="flex flex-col flex-1">
                        {/* Cover Frame (Refactored to aspect-[16/10] for a cleaner card ratio) */}
                        <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden shrink-0 shadow-sm relative mb-5">
                          {blog.coverImage ? (
                            <img
                              src={blog.coverImage}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                            />
                          ) : (
                            <CoverFallback category={blog.category} />
                          )}
                          <span className="absolute top-3.5 left-3.5 text-[9px] font-extrabold text-primary uppercase tracking-widest bg-white px-2.5 py-1 rounded-full shadow border border-slate-100">
                            {blog.category}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="text-[9px] font-bold text-text-muted font-accent uppercase tracking-widest mb-2.5">
                              {readingTime}
                            </div>
                            <h3 className="font-extrabold text-lg sm:text-xl text-secondary font-heading group-hover:text-primary transition-colors duration-300 leading-snug mb-3">
                              {blog.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-text-muted font-body leading-relaxed mb-6 line-clamp-3">
                              {blog.excerpt}
                            </p>
                          </div>
                        </div>
                      </Link>

                      <div className="flex items-center justify-between gap-4 pt-4.5 border-t border-slate-100 mt-auto">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0 bg-slate-50">
                            {blog.author?.image ? (
                              <img
                                src={blog.author.image}
                                alt={blog.author.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-primary/10 flex items-center justify-center font-bold text-[10px] text-primary uppercase font-heading">
                                {authorInitials}
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs text-secondary leading-tight">{blog.author?.name || "Clinic Writer"}</h4>
                            <p className="text-[9px] text-text-muted font-medium uppercase tracking-wider mt-0.5">{publishDate}</p>
                          </div>
                        </div>

                        <Link
                          to={`/blog/${blog.slug}`}
                          className="flex items-center gap-1 text-primary text-[10px] font-bold uppercase tracking-wider font-accent group-hover:translate-x-1 transition-transform duration-300 shrink-0"
                        >
                          Read
                          <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

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

        {/* 3. High-End Newsletter Sign-up Callout (Commented out for future implementation)
        <div className="mt-24 max-w-4xl mx-auto bg-gradient-to-r from-secondary to-bg-dark border border-slate-800 p-8 sm:p-12 rounded-[32px] shadow-2xl relative overflow-hidden text-center sm:text-left">
          <div className="absolute inset-0 bg-grid-blueprint-dark opacity-10 pointer-events-none" />
          <div className="absolute -top-1/4 -right-1/4 w-[350px] h-[350px] rounded-full bg-primary-glow blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-12">
            <div className="max-w-md">
              <span className="inline-block text-primary text-[10px] font-extrabold tracking-widest uppercase mb-3">
                clinical publications digest
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-heading leading-tight mb-3">
                Subscribe to our Health Journal
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-body leading-relaxed">
                Get monthly research reviews, rehabilitation exercises, and clinical wellness columns directly from our physical therapists.
              </p>
            </div>
            
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-5 py-3.5 rounded-full border border-slate-700 bg-white/5 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/45 text-white text-xs sm:text-sm font-semibold transition-all min-w-[240px] shadow-inner"
              />
              <button 
                type="submit"
                className="px-6 py-3.5 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary-hover shadow-lg hover:shadow-primary/10 transition-premium cursor-pointer"
              >
                Join Digest
              </button>
            </form>
          </div>
        </div>
        */}
      </div>
    </section>
  );
};

export default Blog;