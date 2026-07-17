import { useState } from "react";
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBranding } from "../../context/BrandingContext";
import { useIsPWA } from "../../hooks/useIsPWA";
import { usePWAInstall } from "../../hooks/usePWAInstall";

const Logo = ({ settings, firstWord, secondWord }) => {



  //  const showPWAChrome = isPwa && isMobile;



  if (!settings) return null;
  return (
    <div className="flex items-center gap-2">

      {settings.logo ? (
        <img src={settings.logo} alt={settings.name} className="w-8.5 h-8.5 object-contain shrink-0 rounded-full" />
      ) : (
        /* Custom medical cell/leaf node healing logo */
        <svg className="w-8.5 h-8.5 shrink-0" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 3.5C18 3.5 7 11.5 7 21.5C7 28.1274 12.3726 33.5 19 33.5C25.6274 33.5 31 28.1274 31 21.5C31 11.5 18 3.5 18 3.5Z" stroke="var(--primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 3.5V33.5" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="3,3" />
          <circle cx="18" cy="13" r="3.5" fill="var(--accent)" />
          <circle cx="12" cy="19.5" r="3" fill="var(--primary)" />
          <circle cx="24" cy="19.5" r="3" fill="var(--primary)" />
          <circle cx="18" cy="26" r="3.5" fill="var(--accent)" />
        </svg>
      )}

      {settings.name === "PhysioCare" ? (
        <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-secondary whitespace-nowrap">
          Physio<span className="text-primary font-accent font-extrabold">Care</span>
        </span>
      ) : (
        <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-secondary whitespace-nowrap">
          <span className="text-primary font-accent font-extrabold">{firstWord}</span> {secondWord}
        </span>
      )}

    </div>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { settings } = useBranding();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPwa = useIsPWA();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const { isInstallable, installPWA } = usePWAInstall();

  const handleInstall = async () => {
    const success = await installPWA();
    if (success) {
      handleDismiss();
    }
  };

  const words = (settings?.name || "").split(" ");

  const firstWord = words[0];
  const secondWord = words.slice(1).join(" ");

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
    } catch { }
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Blogs", path: "/blog" },
    { name: "Resources", path: "/resources" },
    { name: "Contact", path: "/contact" },
  ];



  return (
    <header className="sticky top-0 w-full z-50 bg-white/70 backdrop-blur-lg border-b border-slate-200/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between relative z-50">

        {/* Logo */}
        <Link to="/" className="flex items-center cursor-pointer">
          <Logo settings={settings} firstWord={firstWord} secondWord={secondWord} />
        </Link>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-5 xl:gap-8">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-wide transition-colors duration-200 cursor-pointer font-accent ${isActive
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-text-muted hover:text-primary"
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop Auth */}
        <div className="hidden xl:flex items-center gap-4">

          {user ? (
            <>
              {user?.role === "admin" ? (
                <NavLink
                  to="/admin"
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-slate-100 hover:bg-slate-200 text-secondary transition-premium"
                >
                  Admin Panel
                </NavLink>
              ) : (
                <NavLink
                  to="/dashboard"
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-slate-100 hover:bg-slate-200 text-secondary transition-premium"
                >
                  Dashboard
                </NavLink>
              )}

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-premium cursor-pointer"
              >
                Logout
              </button>

            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm font-semibold text-text-muted hover:text-primary transition-colors cursor-pointer font-accent"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary-hover text-white rounded-xl shadow-md shadow-primary/10 hover:shadow-lg transition-premium cursor-pointer"
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex xl:hidden items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100 text-secondary transition-colors cursor-pointer relative"
          aria-label="Toggle Menu"
        >
          <div className="w-5 h-5 relative flex items-center justify-center">
            <span className={`absolute w-5 h-0.5 bg-current rounded transition-all duration-300 ${mobileMenuOpen ? "rotate-45" : "-translate-y-1.5"
              }`} />
            <span className={`absolute w-5 h-0.5 bg-current rounded transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""
              }`} />
            <span className={`absolute w-5 h-0.5 bg-current rounded transition-all duration-300 ${mobileMenuOpen ? "-rotate-45" : "translate-y-1.5"
              }`} />
          </div>
        </button>
      </nav>

      {/* Mobile Menu Dropdown Panel */}
      <div className={`absolute top-[100%] left-0 w-full bg-white backdrop-blur-xl border-b border-slate-200/80 shadow-lg py-6 px-6 xl:hidden flex flex-col gap-5 z-40 transition-all duration-300 ease-in-out origin-top ${mobileMenuOpen
        ? "opacity-100 translate-y-0 pointer-events-auto visible"
        : "opacity-0 -translate-y-4 pointer-events-none invisible"
        }`}>
        <ul className="lg:hidden flex flex-col gap-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base font-semibold tracking-wide transition-colors block py-1 cursor-pointer font-accent ${isActive ? "text-primary" : "text-text-muted hover:text-primary"
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="pt-4 border-t border-slate-100 lg:border-0 lg:p-0 flex flex-col gap-3">

          {user ? (
            <>

              {(isPwa || !isInstallable) ? <></> :
                <button
                  onClick={handleInstall}
                  className="w-full text-center py-3 text-sm font-bold uppercase tracking-wider rounded-xl bg-slate-100 text-secondary"
                >
                  Download Our App
                </button>
              }

              {user?.role === "admin" ? (
                <NavLink
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-sm font-bold uppercase tracking-wider rounded-xl bg-slate-100 text-secondary"
                >
                  Admin Panel
                </NavLink>
              ) : (
                <NavLink
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-sm font-bold uppercase tracking-wider rounded-xl bg-slate-100 text-secondary"
                >
                  Dashboard
                </NavLink>
              )}

              <button
                onClick={handleLogout}
                className="w-full py-3 text-sm font-bold uppercase tracking-wider rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-premium cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>

              {(isPwa || !isInstallable) ? <></> :
                <button
                  onClick={handleInstall}
                  className="w-full uppercase text-center bg-bg-offwhite py-3 text-sm font-semibold text-text-muted hover:text-primary border border-slate-200 rounded-xl"
                >
                  Download Our App
                </button>
              }

              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full uppercase text-center bg-bg-offwhite py-3 text-sm font-semibold text-text-muted hover:text-primary border border-slate-200 rounded-xl"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-sm font-bold uppercase tracking-wider bg-primary text-white rounded-xl shadow-md"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;