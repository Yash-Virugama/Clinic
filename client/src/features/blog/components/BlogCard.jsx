import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog, settings }) => {
  // Calculate reading time helper
  const getReadingTime = (content) => {
    const words = content ? content.split(/\s+/).length : 0;
    const minutes = Math.ceil(words / 220); // 220 words per min avg
    return `${minutes} min read`;
  };

  const readingTime = getReadingTime(blog.content);
  const authorInitials = blog.author?.name?.charAt(0) || "P";
  const publishDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

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
    <article
      className="bg-white/40 border border-slate-200/60 rounded-3xl p-4 pb-4.5 sm:p-6.5 hover:border-primary/20 hover:shadow-xl transition-premium group relative flex flex-col justify-between gap-4 sm:gap-6 min-h-[400px] text-left"
    >
      <Link to={`/blog/${blog.slug}`} className="flex flex-col flex-1">
        {/* Cover Frame */}
        <div className="w-full aspect-video rounded-2xl overflow-hidden shrink-0 shadow-sm relative mb-5">
          {blog.coverImage ? (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
            />
          ) : (
            <CoverFallback category={blog.category} />
          )}
          <span className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 text-[9px] font-extrabold text-primary uppercase tracking-widest bg-white px-2 sm:px-2.5 py-1 rounded-full shadow border border-slate-100">
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
            <p className="text-xs sm:text-sm text-text-muted font-body leading-relaxed mb-4.5 line-clamp-3">
              {blog.excerpt}
            </p>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-4 pt-4.5 border-t border-slate-200 mt-auto">
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
};

export default BlogCard;