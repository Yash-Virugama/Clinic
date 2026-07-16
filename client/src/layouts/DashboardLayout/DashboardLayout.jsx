import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardSidebar from "../../components/DashboardSidebar/DashboardSidebar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg-offwhite flex relative">
      
      {/* Sidebar Component with mobile open state handlers */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Workspace Frame */}
      <main className="flex-1 min-h-screen bg-grid-blueprint relative px-4 py-8 sm:p-8 lg:p-10 overflow-y-auto overflow-x-hidden lg:ml-72">
        
        {/* Mobile Header with Hamburger Trigger */}
        <div className="flex lg:hidden items-center justify-between px-6 py-4.5 bg-white border-b border-slate-200/70 absolute top-0 left-0 right-0 z-20 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-secondary hover:bg-slate-50 transition-all shrink-0 cursor-pointer"
            aria-label="Open Sidebar"
          >
            <svg className="w-6 h-6 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <span className="font-extrabold text-xs text-secondary uppercase tracking-wider font-heading">
            Patient Portal
          </span>
          <div className="w-9" /> {/* Spacer */}
        </div>

        {/* Adjust spacing on mobile for top bar */}
        <div className="pt-16 lg:pt-0">
          {/* Glow Ambient Spots */}
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-primary-glow/20 blur-[90px] pointer-events-none z-0" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent-glow/20 blur-[90px] pointer-events-none z-0" />

          <div key={location.pathname} className="relative z-10 max-w-4xl mx-auto animate-page-entrance">
            <Outlet />
          </div>
        </div>

      </main>
    </div>
  );
};

export default DashboardLayout;