import React from "react";

const PageHeader = ({ badge, title, highlightWord, description }) => (
  <div className="text-center max-w-2xl mx-auto mb-15 sm:mb-24">
    {badge && (
      <span className="inline-block text-primary text-xs font-bold tracking-wider uppercase mb-3.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 font-accent animate-pulse">
        {badge}
      </span>
    )}
    <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-bold tracking-tight text-secondary font-heading leading-tight">
      {title}{" "}
      {highlightWord && (
        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {highlightWord}
        </span>
      )}
    </h1>
    {description && (
      <p className="text-sm sm:text-base text-text-muted mt-5 font-body leading-relaxed max-w-lg mx-auto">
        {description}
      </p>
    )}
  </div>
);

export default PageHeader;
