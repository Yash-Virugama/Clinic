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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-primary backdrop-blur-xl shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom,0px)] h-[calc(3.8rem+env(safe-area-inset-bottom,0px))] transition-all duration-300 ease-out lg:hidden">
      <div className="flex justify-around h-full max-w-[600px] mx-auto px-1.5">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full transition-all duration-250 relative pt-0 font-accent ${
                isActive ? "text-bg-dark-accent font-bold" : "text-text-light"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`flex items-center justify-center w-[38px] h-[38px] rounded-xl transition-all duration-250 ${
                  isActive ? "bg-primary/8 shadow-[0_4px_10px_rgba(37,99,235,0.08)] -translate-y-[2px]" : ""
                }`}>
                  {tab.icon}
                </div>
                <span className={`text-[10px] font-semibold tracking-wide opacity-85 transition-all duration-250 ${
                  isActive ? "scale-[1.05]" : ""
                }`}>
                  {tab.name}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default PWANavigation;
