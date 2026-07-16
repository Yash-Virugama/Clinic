import "./AdminHeader.css";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const AdminHeader = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-35 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4.5 flex items-center justify-between">
      
      {/* Left section: Hamburger toggle and section title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100/80 transition-colors cursor-pointer"
        >
          <svg className="w-5.5 h-5.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-accent block leading-none mb-1">
            System Workspace
          </span>
          <h1 className="text-base font-bold text-secondary font-heading leading-none">
            Control Dashboard
          </h1>
        </div>
      </div>
      
      {/* Right section: Admin user avatar and credentials */}
      {user && (
        <div className="flex items-center gap-3.5">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-secondary block leading-tight">
              {user.name}
            </span>
            <span className="text-[10px] font-medium text-slate-400 block leading-tight">
              {user.role === "admin" ? "Administrator" : "Therapist"}
            </span>
          </div>
          <Link to="/admin/profile" title="Admin Settings Hub" className="shrink-0">
            {user.image ? (
              <img 
                src={user.image} 
                alt="Admin Profile" 
                className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm hover:border-primary transition-all duration-200 cursor-pointer" 
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-sm text-primary shadow-inner hover:border-primary transition-all duration-200 cursor-pointer">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;