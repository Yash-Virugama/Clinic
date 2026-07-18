import "./AdminLayout.css";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import AdminHeader from "../../components/AdminHeader/AdminHeader";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Responsive admin sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Main admin content container */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <main key={location.pathname} className="flex-1 p-6 sm:p-8 bg-grid-blueprint max-w-7xl w-full mx-auto relative z-10 animate-page-entrance">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;