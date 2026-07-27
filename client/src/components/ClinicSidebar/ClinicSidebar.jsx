import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBranding } from "../../context/BrandingContext";

const ClinicSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { settings } = useBranding();

  const handleLogout = async () => {
    await logout();
    if (onClose) onClose();
  };

  const navItems = [
    {
      to: "/clinic",
      label: "Dashboard",
      exact: true,
      icon: (
        <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    {
      to: "/clinic/appointments",
      label: "Appointments",
      icon: (
        <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
        </svg>
      )
    },
    {
      to: "/clinic/patients",
      label: "Patients",
      icon: (
        <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 11a4 4 0 100-8 4 4 0 000 8z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M23 12h-2.5l-1-2.5-1.5 5-1-3.5H15" />
        </svg>
      )
    },
    {
      to: "/clinic/payments",
      label: "Payments",
      icon: (
        <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 5h12M6 9h12M9 5v8c3 0 6-1 6-4s-3-4-6-4M9 13l8 8" />
        </svg>
      )
    },
    {
      to: "/clinic/report",
      label: "Report",
      icon: (
        <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zM9 13.5h6m-6 3h6" />
        </svg>
      )
    }
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-darkblue border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/50">
        <NavLink to="/" className="flex items-center gap-3" onClick={() => onClose && onClose()}>
          {settings?.logo ? (
            <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow">
              <img
                src={settings.logo}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
              <svg className="w-4 h-4 text-primary stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
          )}
          <span className="font-heading text-sm font-bold text-slate-100 tracking-tight leading-none truncate max-w-[150px]">
            {settings?.name || "PhysioCare"}
          </span>
        </NavLink>

        {/* Dismiss Button on Mobile */}
        <button
          onClick={() => onClose && onClose()}
          className="lg:hidden text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          aria-label="Close Sidebar"
        >
          <svg className="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation Directory */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            onClick={() => onClose && onClose()}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border ${
                isActive
                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                  : "bg-transparent border-transparent text-slate-400 hover:text-slate-250 hover:bg-slate-900/60"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Action Footer */}
      <div className="p-4 bg-[#090d16] border-t border-slate-800/50">
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-premium cursor-pointer"
        >
          <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default ClinicSidebar;
