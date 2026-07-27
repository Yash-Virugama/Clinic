import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ClinicSidebar from "../../components/ClinicSidebar/ClinicSidebar";
import ClinicNavbar from "../../components/ClinicNavbar/ClinicNavbar";
import ClinicHeader from "../../components/ClinicHeader/ClinicHeader";

const ClinicLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-offwhite flex flex-col lg:flex-row relative w-full overflow-x-hidden">
      {/* Sidebar for Desktop layouts & sliding toggle for Mobile */}
      <ClinicSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Backdrop overlay for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-h-screen pb-20 lg:pb-0 w-full lg:pl-72">
        {/* Top Header */}
        <ClinicHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-8 bg-grid-blueprint relative z-10 animate-page-entrance max-w-7xl w-full mx-auto">
          {/* Ambient Glows */}
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-primary-glow/20 blur-[90px] pointer-events-none z-0" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent-glow/20 blur-[90px] pointer-events-none z-0" />

          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Navbar for Mobile/Small Screen layouts */}
      <ClinicNavbar />
    </div>
  );
};

export default ClinicLayout;
