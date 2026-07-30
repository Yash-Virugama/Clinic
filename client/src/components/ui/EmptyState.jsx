import React from "react";

const EmptyState = ({ title = "No Data Available", description = "Please check back later." }) => (
  <div className="flex flex-col h-[50vh] items-center justify-center bg-bg-offwhite bg-grid-blueprint text-center p-6">
    <h2 className="text-2xl font-bold text-secondary font-heading mb-2">{title}</h2>
    <p className="text-text-muted max-w-sm font-body text-xs sm:text-sm">{description}</p>
  </div>
);

export default EmptyState;
