import "./Footer.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBranding } from "../../context/BrandingContext";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const FooterLogo = ({ settings }) => (
  <div className="flex items-center gap-2">
    {settings.logo ? (
      <img src={settings.logo} alt={settings.name} className="w-8.5 h-8.5 object-contain shrink-0 rounded-full" />
    ) : (
      <svg className="w-8.5 h-8.5 shrink-0" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 3.5C18 3.5 7 11.5 7 21.5C7 28.1274 12.3726 33.5 19 33.5C25.6274 33.5 31 28.1274 31 21.5C31 11.5 18 3.5 18 3.5Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 3.5V33.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.3" />
        <circle cx="18" cy="13" r="3.5" fill="var(--accent)" />
        <circle cx="12" cy="19.5" r="3" fill="var(--primary)" />
        <circle cx="24" cy="19.5" r="3" fill="var(--primary)" />
        <circle cx="18" cy="26" r="3.5" fill="var(--accent)" />
      </svg>
    )}
    <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-white">
      {settings.name === "PhysioCare" ? (
        <>
          Physio<span className="text-primary font-accent font-extrabold">Care</span>
        </>
      ) : (
        settings.name
      )}
    </span>
  </div>
);

const Footer = () => {
  const { user, logout } = useAuth();
  const { settings } = useBranding();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <footer className="relative bg-darkblue text-slate-400 pt-8 pb-6 sm:pt-12 sm:pb-10 overflow-hidden bg-grid-blueprint-dark border-t border-slate-900">
      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 bg-grid-blueprint-dark opacity-15 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Main Grid Content */}
        <div className="footer-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8 mb-8 sm:mb-10">

          {/* About Column */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <FooterLogo settings={settings} />
            <p className="text-xs sm:text-sm text-slate-400 font-body leading-relaxed">
              Helping you recover, move better, and live a pain-free life with expert physiotherapy care. Our approach combines clinical diagnostics with custom manual therapies.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900 border border-slate-800/80 hover:bg-primary hover:border-primary text-slate-300 hover:text-white flex items-center justify-center transition-premium"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </a>
              )}

              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900 border border-slate-800/80 hover:bg-primary hover:border-primary text-slate-300 hover:text-white flex items-center justify-center transition-premium"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              )}

              {settings?.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900 border border-slate-800/80 hover:bg-primary hover:border-primary text-slate-300 hover:text-white flex items-center justify-center transition-premium"
                  aria-label="Youtube"
                >
                  <FaYoutube className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              )}

            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-heading text-white text-xs sm:text-sm font-bold tracking-wider uppercase mb-4 sm:mb-6">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors duration-200">Home</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-primary transition-colors duration-200">Services</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary transition-colors duration-200">Blogs</Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-primary transition-colors duration-200">Resources</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors duration-200">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Patient Links Column */}
          <div>
            {!user ?
              <>
                <h3 className="font-heading text-white text-xs sm:text-sm font-bold tracking-wider uppercase mb-4 sm:mb-6">
                  Patient
                </h3>
                <ul className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm">
                  <li>
                    <Link to="/login" className="hover:text-primary transition-colors duration-200">Login</Link>
                  </li>
                  <li>
                    <Link to="/register" className="hover:text-primary transition-colors duration-200">Register</Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="hover:text-primary transition-colors duration-200">Dashboard</Link>
                  </li>
                </ul>
              </> :

              <>
                {user?.role === "admin" ?
                  <>
                    <h3 className="font-heading text-white text-xs sm:text-sm font-bold tracking-wider uppercase mb-4 sm:mb-6">
                      Admin
                    </h3>
                    <ul className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm">
                      <li>
                        <Link to="/admin" className="hover:text-primary transition-colors duration-200">Admin Panel</Link>
                      </li>
                      <li>
                        <button onClick={handleLogout} className="hover:text-primary transition-colors duration-200 cursor-pointer">Logout</button>
                      </li>
                    </ul>
                  </> :

                  <>
                    <h3 className="font-heading text-white text-xs sm:text-sm font-bold tracking-wider uppercase mb-4 sm:mb-6">
                      Patient
                    </h3>
                    <ul className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm">
                      <li>
                        <Link to="/dashboard" className="hover:text-primary transition-colors duration-200">Dashboard</Link>
                      </li>
                      <li>
                        <button onClick={handleLogout} className="hover:text-primary transition-colors duration-200 cursor-pointer">Logout</button>
                      </li>
                    </ul>
                  </>}
              </>}
            
          </div>

          {/* Contact Details Column */}
          <div className="flex flex-col gap-4 sm:gap-5 min-w-0 sm:min-w-[300px]">
            <h3 className="font-heading text-white text-xs sm:text-sm font-bold tracking-wider uppercase mb-1 sm:mb-2">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-2.5 sm:gap-3.5 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0 mt-0.5" />
                <span>{settings?.address || "Address not available"}</span>
              
              </li>
              <li className="flex items-start gap-2.5">
                <FaPhoneAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0 mt-0.5" />
                <a href={settings?.phone ? `tel:${settings.phone}` : "#"} className="hover:text-primary transition-colors">{settings?.phone || "Phone not available"}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <FaEnvelope className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0 mt-0.5" />
                <a href={settings?.emailGeneral ? `mailto:${settings.emailGeneral}` : "#"} className="hover:text-primary transition-colors">{settings?.emailGeneral || "Email not available"}</a>
              </li>
            </ul>

            <div className="pt-1">
              <h4 className="font-heading text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-1.5 sm:mb-2">
                Working Hours
              </h4>
              <ul className="flex flex-col gap-1 text-[11px] sm:text-[13px] text-slate-400 font-body">
                <li className="flex justify-between border-b border-slate-900 pb-1">
                  <span>Timing: </span>
                  <span className="text-white font-medium">{settings?.workingHours || "Data not available"}</span>
                </li>
                <li className="flex justify-between">
                  <span>Off Day:</span>
                  <span className="text-red-500 font-semibold uppercase tracking-wider text-[10px] sm:text-[11px] mt-0.5">{settings?.closedHours || "Data not available"}</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom copyright segment */}
        <div className="pt-6 sm:pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[11px] sm:text-xs text-center sm:text-left">
          <p>© {new Date().getFullYear()} {settings?.name || "PhysioCare"}. All Rights Reserved.</p>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Link to="/privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
            <span className="text-slate-800">|</span>
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors duration-200">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;