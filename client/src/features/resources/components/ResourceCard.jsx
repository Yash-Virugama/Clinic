import React, { useState } from "react";

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
    default:
      return "bg-primary hover:bg-primary/90 border-primary text-white";
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

const ResourceCard = ({ resource }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const format = getFileFormat(resource.fileUrl, resource.fileName);
  const formatStyle = getFormatBadgeStyle(format);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (isDownloading) return;
    setIsDownloading(true);
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
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="bg-gradient-to-b from-[#0f172a] to-[#0b1329] border border-slate-800 rounded-[28px] p-5.5 hover:border-slate-700/85 hover:shadow-2xl hover:shadow-primary/5 transition-premium group relative flex flex-col justify-between min-h-[450px] text-left overflow-hidden"
    >
      {/* Format-Specific Corner Glow Overlay */}
      <div className={`absolute -top-16 -right-16 w-36 h-36 rounded-full bg-gradient-to-br ${getFormatGlow(format)} blur-2xl opacity-40 group-hover:opacity-85 transition-opacity duration-500 pointer-events-none z-0`} />

      <div className="relative z-10">
        {/* Visual Google Drive Preview Thumbnail */}
        <DocumentPreviewThumbnail format={format} title={resource.title} />

        {/* Metadata Header */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            {/* Admin profile picture avatar frame */}
            <div className="w-8 h-8 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
              {resource.author?.image ? (
                <img
                  src={resource.author.image}
                  alt={resource.author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center font-bold text-[10px] text-primary uppercase font-heading">
                  {resource.author?.name?.charAt(0) || "A"}
                </div>
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[12px] font-extrabold text-slate-200 leading-tight">
                {resource.author?.name || "Admin"}
              </span>
              <span className="text-[8px] font-bold text-text-muted uppercase tracking-widest mt-0.5">
                {resource.category}
              </span>
            </div>
          </div>
          <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${formatStyle}`}>
            {format}
          </span>
        </div>

        <h3 className={`font-extrabold text-base text-slate-100 font-heading ${getFormatTextColorClass(format)} transition-colors duration-300 leading-snug mb-2`}>
          {resource.title}
        </h3>
        <p className="text-xs text-slate-300/90 font-body leading-relaxed mb-6 line-clamp-2">
          {resource.description}
        </p>
      </div>

      {/* Downloader Action Row */}
      <div className="relative z-10">
        {resource.fileUrl ? (
          <button
            onClick={handleDownload}
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
};

export default ResourceCard;