import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const ClinicNavbar = () => {
  const { user } = useAuth();

  const clinicPrefix = user?.role === "admin" ? "/clinic" : `/staff/${user?.role}/clinic`;

  const hasPerm = (requiredPerms) => {
    if (user?.role === "admin") return true;
    return requiredPerms.some((perm) => user?.permissions?.includes(perm));
  };

  const rawItems = [
    {
      to: clinicPrefix,
      label: "Home",
      exact: true,
      visible: hasPerm(["clinic:dashboard"]),
      icon: (
        <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    {
      to: `${clinicPrefix}/appointments`,
      label: "Appts",
      visible: hasPerm(["appointments:view", "appointments:manage"]),
      icon: (
        <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
        </svg>
      )
    },
    {
      to: `${clinicPrefix}/patients`,
      label: "Patients",
      visible: hasPerm(["patients:view", "patients:manage"]),
      icon: (
        <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 11a4 4 0 100-8 4 4 0 000 8z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M23 12h-2.5l-1-2.5-1.5 5-1-3.5H15" />
        </svg>
      )
    },
    {
      to: `${clinicPrefix}/payments`,
      label: "Payments",
      visible: hasPerm(["payments:view", "payments:manage"]),
      icon: (
        <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 5h12M6 9h12M9 5v8c3 0 6-1 6-4s-3-4-6-4M9 13l8 8" />
        </svg>
      )
    },
    {
      to: `${clinicPrefix}/report`,
      label: "Report",
      visible: hasPerm(["reports:view"]),
      icon: (
        <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zM9 13.5h6m-6 3h6" />
        </svg>
      )
    }
  ];

  const navItems = rawItems.filter((item) => item.visible);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-35 bg-white border-t border-slate-200/80 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex items-center justify-around py-1.5 pb-2.5 px-1.5 lg:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.exact}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              isActive ? "text-primary" : "text-slate-400 hover:text-slate-600"
            }`
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default ClinicNavbar;
