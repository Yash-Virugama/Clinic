import "./AdminDashboard.css";
import useAdminDashboard from "../../../hooks/useAdminDashboard";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const AdminDashboard = () => {
  const { stats, loading, handleDownloadPatients } = useAdminDashboard();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-405 font-accent">
          Loading system metrics...
        </span>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const cardsData = [
    {
      to: "/admin/services",
      title: "Services Count",
      count: stats.totalServices,
      label: "View Services",
      icon: (
        <svg className="w-6 h-6 text-primary stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      to: "/admin/blogs",
      title: "Blog Articles",
      count: stats.totalBlogs,
      label: "Manage Posts",
      icon: (
        <svg className="w-6 h-6 text-primary stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 17.75V6.75A2.25 2.25 0 015.25 4.5h10.5a2.25 2.25 0 012.25 2.25v.75m-3 3h.008v.008H12v-.008z" />
        </svg>
      )
    },
    {
      to: "/admin/resources",
      title: "Shared Resources",
      count: stats.totalResources,
      label: "Vault Manager",
      icon: (
        <svg className="w-6 h-6 text-primary stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      )
    },
    {
      to: "/admin/testimonials",
      title: "Pending Reviews",
      count: stats.pendingTestimonials,
      label: "Moderation Queue",
      isPending: stats.pendingTestimonials > 0,
      icon: (
        <svg className={`w-6 h-6 stroke-[2] ${stats.pendingTestimonials > 0 ? "text-amber-500 animate-pulse" : "text-primary"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      )
    },
    {
      to: "/admin/contacts",
      title: "Contact Messages",
      count: stats.totalContacts,
      label: "View Inbox",
      icon: (
        <svg className="w-6 h-6 text-primary stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* 1. Greeting Banner */}
      <div className="w-full bg-white border border-slate-200/60 rounded-[32px] p-8 sm:p-10 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 bg-grid-blueprint opacity-[0.02] pointer-events-none" />

        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-accent block mb-2">
            Control Workspace
          </span>
          <h2 className="text-2.5xl font-bold tracking-tight text-secondary font-heading mb-1.5">
            Welcome to the Control Center
          </h2>
          <p className="text-xs text-text-muted font-body leading-relaxed max-w-lg">
            Manage your clinic's services list, publish recovery blogs, upload patient resource sheets, moderate user-submitted reviews, and respond to incoming coordinate inquiries.
          </p>
        </div>

        <div className="shrink-0 px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200/50 text-center sm:text-right shadow-inner">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block leading-none mb-1 font-accent">
            Current Date
          </span>
          <span className="text-xs font-bold text-secondary font-heading">
            {currentDate}
          </span>
        </div>
      </div>

      {/* 2. Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {cardsData.map((card, idx) => (
          <Link
            key={idx}
            to={card.to}
            className={`group bg-white border p-6 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-250 flex flex-col justify-between h-44 ${card.isPending
              ? "border-amber-200/80 bg-amber-50/15"
              : "border-slate-200/60"
              }`}
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading leading-tight">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-2xl border ${card.isPending
                ? "bg-amber-100/40 border-amber-200/50"
                : "bg-primary/5 border-primary/10 group-hover:border-primary/20"
                } transition-colors`}>
                {card.icon}
              </div>
            </div>

            <div className="mt-4">
              <span className="text-4xl font-extrabold text-secondary font-heading tracking-tight">
                {card.count}
              </span>
            </div>

            <div className="flex items-center gap-1 mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-450 group-hover:text-primary transition-colors">
              {card.label}
              <svg className="w-3 h-3 stroke-[2.2] transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* 3. Bottom Panels: Quick Actions & Help Coordinate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Actions Panel */}
        <div className="lg:col-span-12 bg-white border border-slate-200/60 rounded-[32px] p-8 shadow-sm">
          <h3 className="text-lg font-bold text-secondary font-heading mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.649 8.36A6 6 0 009.01 9.54M10.15 4H4v5.62c0 .73.4 1.41 1.05 1.76l8.5 4.63a2.5 2.5 0 003.32-3.32l-4.63-8.5C11.89 4.4 11.21 4 10.48 4z" />
            </svg>
            System Quick Tasks
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <button
              onClick={handleDownloadPatients}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 hover:bg-slate-100/50 hover:border-slate-300 transition-all flex items-center gap-3 cursor-pointer"
            >
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20 shrink-0">
                <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V3m0 0L7.5 7.5M12 3l4.5 4.5M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5" />
                </svg>
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-secondary block">Download Pateints Report</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Get in detail patient report</span>
              </div>
            </button>

            <Link
              to="/admin/blogs"
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 hover:bg-slate-100/50 hover:border-slate-300 transition-all flex items-center gap-3"
            >
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20 shrink-0">
                <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-3.85.87a.375.375 0 01-.448-.448l.87-3.85a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-secondary block">Write Blog Article</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Publish research post</span>
              </div>
            </Link>

            <Link
              to="/admin/settings"
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 hover:bg-slate-100/50 hover:border-slate-300 transition-all flex items-center gap-3"
            >
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20 shrink-0">
                <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124c.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-secondary block">Edit Clinic branding</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Modify logo and site details</span>
              </div>
            </Link>
            <Link
              to="/admin/profile"
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 hover:bg-slate-100/50 hover:border-slate-300 transition-all flex items-center gap-3"
            >
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20 shrink-0">
                <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-secondary block">Manage Profile</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Update credentials</span>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;