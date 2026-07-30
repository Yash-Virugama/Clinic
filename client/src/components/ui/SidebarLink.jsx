import React from "react";
import { NavLink } from "react-router-dom";

const SidebarLink = ({ to, icon, label, onClick, end }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border ${
        isActive
          ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
          : "bg-transparent border-transparent text-slate-400 hover:text-slate-250 hover:bg-slate-900/60"
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export default SidebarLink;
