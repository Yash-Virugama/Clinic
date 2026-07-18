import "./BlogDetails.css";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useBlog from "../../hooks/useBlog";
import { useBranding } from "../../context/BrandingContext";


const BlogDetails = () => {

  const { settings } = useBranding();

  const { slug } = useParams();
  const { blog, loading } = useBlog(slug);

  // Scroll to top immediately on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center lg:h-[calc(100vh-80px)] h-[calc(100vh-72px)] min-h-[50vh] bg-bg-offwhite bg-grid-blueprint">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-muted text-sm font-semibold tracking-wide mt-4 font-accent">Loading article details...</p>
      </div>
    );
  }

  // Reusable Cinematic Blueprint Cover Fallback
  const DetailsCoverFallback = ({ category }) => (
    <div className="w-full aspect-video bg-darkblue bg-grid-blueprint-dark flex flex-col items-center justify-center p-6 sm:p-12 text-center select-none relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/25 via-transparent to-accent/15 pointer-events-none" />
      {/* <div className="flex flex-col justify-center iteams-center"> */}
        <span className="text-white/80 font-bold text-sm uppercase tracking-widest bg-white/10 px-5 py-2 rounded-full border border-white/10 z-10 font-accent backdrop-blur-sm">
          {category}
        </span>
        <span className="text-[0.6rem] sm:text-[1rem] text-white/40 font-bold uppercase tracking-wider mt-4 z-10 font-body">
          {settings?.name || ""} Clinical Publication
        </span>
      {/* </div> */}
    </div>
  );

  if (!blog) {
    if (navigator.onLine === false) {
      return (
        <div className="flex flex-col items-center justify-center sm:h-[calc(100vh-80px)] h-[calc(100vh-72px)] min-h-[55vh] bg-bg-offwhite bg-grid-blueprint text-center p-6">
          <div className="w-[70px] h-[70px] rounded-[18px] bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-6">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold text-secondary font-heading mb-2">Article Unavailable Offline</h2>
          <p className="text-text-muted max-w-sm font-body mb-6">You haven't opened this blog online yet, so it isn't cached in your APP. Connect to the internet to read this post.</p>
          <Link to="/blog" className="px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider shadow hover:bg-primary-hover transition-premium">
            Browse Cached Guides
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center sm:h-[calc(100vh-80px)] h-[calc(100vh-72px)] min-h-[55vh] bg-bg-offwhite bg-grid-blueprint text-center p-6">
        <h2 className="text-2xl font-bold text-secondary font-heading mb-2">Article Not Found</h2>
        <p className="text-text-muted max-w-sm font-body mb-6">The article you are looking for does not exist or has been unpublished.</p>
        <Link to="/blog" className="px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider shadow hover:bg-primary-hover transition-premium">
          Back to Health Library
        </Link>
      </div>
    );
  }

  // Calculate reading time helper
  const getReadingTime = (content) => {
    const words = content ? content.split(/\s+/).length : 0;
    const minutes = Math.ceil(words / 220); // 220 words per min avg
    return `${minutes} min read`;
  };

  // Smart text layout formatter
  const renderBlogContent = (content) => {
    if (!content) return null;
    if (content.includes("<p>") || content.includes("<br>") || content.includes("</div>")) {
      return <div className="blog-rich-text text-secondary leading-relaxed font-body text-base sm:text-lg" dangerouslySetInnerHTML={{ __html: content }} />;
    }
    return content.split(/\r?\n\r?\n/).map((para, idx) => {
      if (!para.trim()) return null;
      return (
        <p key={idx} className="font-body text-secondary leading-relaxed text-base sm:text-lg mb-6.5 text-left text-slate-700">
          {para.trim()}
        </p>
      );
    });
  };

  const publishDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const readingTime = getReadingTime(blog.content);

  return (
    <section className="relative px-6 lg:px-16 pt-10 sm:pt-15 pb-24 sm:pb-28 bg-bg-offwhite overflow-hidden bg-grid-blueprint min-h-[90vh]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary-glow blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent-glow blur-[100px] pointer-events-none z-0" />

      <div className="max-w-3xl mx-auto z-10 relative">
        {/* Back Link */}
        <div className="text-left mb-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover text-xs font-bold uppercase tracking-wider font-accent group transition-colors duration-300"
          >
            <svg className="w-4 h-4 stroke-[2.5] group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Library
          </Link>
        </div>

        {/* Article Header */}
        <div className="text-left mb-10 sm:mb-12">
          <div className="flex items-center gap-3.5 mb-6">
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider bg-primary/10 px-3.5 py-1.5 rounded-full border border-primary/20">
              {blog.category}
            </span>
            <span className="text-[10px] font-bold text-text-muted font-accent uppercase tracking-wider">
              {readingTime}
            </span>
          </div>

          <h1 className="text-3.5xl sm:text-4.5xl md:text-5.5xl font-bold tracking-tight text-secondary font-heading leading-tight mb-4 sm:mb-8">
            {blog.title}
          </h1>

          {/* Author Meta Info */}
          <div className="flex items-center justify-start gap-4 pt-6 border-t border-slate-200/60">
            <div className="w-12 h-12 rounded-full border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0 bg-slate-50">
              {blog.author?.image ? (
                <img
                  src={blog.author.image}
                  alt={blog.author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary uppercase font-heading">
                  {blog.author?.name?.charAt(0) || "A"}
                </div>
              )}
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-secondary leading-tight">
                {blog.author?.name || "PhysioCare Clinical Specialist"}
              </h4>
              <p className="text-[10px] sm:text-xs text-text-muted font-medium uppercase tracking-wider mt-0.5">
                Published on {publishDate}
              </p>
            </div>
          </div>
        </div>

        {/* Cinematic Cover Image (Reduced size and centered to align with the text column) */}
        <div className="max-w-2xl mx-auto aspect-video rounded-[20px] overflow-hidden shadow-xl border border-slate-200/50 bg-white mb-10 sm:mb-14">
          {blog.coverImage ? (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <DetailsCoverFallback category={blog.category} />
          )}
        </div>

        {/* Excerpt/Introduction Blockquote */}
        <blockquote className="text-left font-body italic text-lg sm:text-xl text-slate-800 leading-relaxed border-l-4 border-l-primary pl-3 sm:pl-6 my-10 relative">
          "{blog.excerpt}"
        </blockquote>

        {/* Main Article Content */}
        <div className="blog-content-body text-left mt-8">
          {renderBlogContent(blog.content)}
        </div>

        {/* Footer Navigation */}
        <div className="mt-16 text-left">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover text-xs font-bold uppercase tracking-wider font-accent group transition-colors duration-300"
          >
            <svg className="w-4 h-4 stroke-[2.5] group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Return to Health Library
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;