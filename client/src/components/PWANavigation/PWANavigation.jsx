import "./PWANavigation.css";
import { NavLink } from "react-router-dom";
import { FaHome, FaBriefcaseMedical, FaFolderOpen, FaUser, FaEnvelope, FaQuoteLeft, FaNewspaper } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const PWANavigation = () => {
  const { user } = useAuth();
  const dashboardPath = user?.role === "admin" ? "/admin" : "/dashboard";
  const dashboardName = user?.role === "admin" ? "Admin" : "Dashboard";

  const tabs = [
    { name: "Home", path: "/", icon: <FaHome className="w-5 h-5" /> },
    { name: "Services", path: "/services", icon: <FaBriefcaseMedical className="w-5 h-5" /> },
    { name: "Blogs", path: "/blogs", icon: <FaNewspaper className="w-5 h-5" /> },
    { name: "Resources", path: "/resources", icon: <FaFolderOpen className="w-5 h-5" /> },
    { name: "Reviews", path: "/testimonials", icon: <FaQuoteLeft className="w-5 h-5" /> },
    { name: "Contact", path: "/contact", icon: <FaEnvelope className="w-5 h-5" /> }
  ];

  return (
    <nav className="pwa-bottom-nav">
      <div className="pwa-bottom-nav-container">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `pwa-nav-item ${isActive ? "active" : ""}`
            }
          >
            <div className="pwa-nav-icon-container">
              {tab.icon}
            </div>
            <span className="pwa-nav-label">{tab.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default PWANavigation;
