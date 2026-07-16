import "./Contact.css";
import { useEffect } from "react";
import { useBranding } from "../../context/BrandingContext";
import ContactForm from "../../components/ContactForm/ContactForm";

const Contact = () => {
  const { settings } = useBranding();

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="relative px-6 lg:px-16 pt-10 sm:pt-15 pb-24 sm:pb-28 bg-bg-offwhite overflow-hidden bg-grid-blueprint min-h-[90vh]">
      {/* Ambient background lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary-glow blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent-glow blur-[100px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Interactive Clinic Details & Coordinates */}
          <div className="lg:col-span-5 flex flex-col gap-8 text-left">
            <div>
              <span className="inline-block text-primary text-xs font-bold tracking-wider uppercase mb-3.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 font-accent animate-pulse">
                Connect With Us
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-secondary font-heading leading-tight mb-5">
                Let's Start Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Recovery</span>
              </h1>
              <p className="text-sm sm:text-base text-text-muted font-body leading-relaxed max-w-lg">
                Have questions about our physical therapy programs, stretching guides, or rehabilitation schedules? Our clinical therapists at <strong className="text-secondary font-semibold">{settings?.name || "PhysioCare"}</strong> are here to guide you.
              </p>
            </div>

            {/* Quick Contact Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Address */}
              <div className="bg-white/50 border border-slate-200/65 backdrop-blur-sm rounded-2xl p-4.5 shadow-sm hover:border-primary/20 transition-premium">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-extrabold text-xs text-secondary uppercase tracking-wider font-heading">Our Clinic</h3>
                </div>
                <p className="text-xs text-text-muted font-body leading-relaxed">
                  {settings?.address || "Address not available"}
                </p>
              </div>

              {/* Contact Numbers */}
              <div className="bg-white/50 border border-slate-200/65 backdrop-blur-sm rounded-2xl p-4.5 shadow-sm hover:border-primary/20 transition-premium">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="font-extrabold text-xs text-secondary uppercase tracking-wider font-heading">Call Us</h3>
                </div>
                <p className="text-xs text-text-muted font-body leading-relaxed">
                  Phone: {settings?.phone || "Not available"}
                  {/* <br />Emergency: {settings?.emergencyPhone || "+91 98765 43211"} */}
                </p>
              </div>

              {/* Email Support */}
              <div className="bg-white/50 border border-slate-200/65 backdrop-blur-sm rounded-2xl p-4.5 shadow-sm hover:border-primary/20 transition-premium">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-extrabold text-xs text-secondary uppercase tracking-wider font-heading">Email Details</h3>
                </div>
                <p className="text-xs text-text-muted font-body leading-relaxed">
                  {/* General:  */}{settings?.emailGeneral || "Not available"}
                  {/* <br />Therapists: {settings?.emailRehab || "rehab@physiocare.com"} */}
                </p>
              </div>

              {/* Working Hours */}
              <div className="bg-white/50 border border-slate-200/65 backdrop-blur-sm rounded-2xl p-4.5 shadow-sm hover:border-primary/20 transition-premium">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-extrabold text-xs text-secondary uppercase tracking-wider font-heading">Hours</h3>
                </div>
                <p className="text-xs text-text-muted font-body leading-relaxed">
                  {settings?.workingHours || "Data not available"}<br />
                  {settings?.closedHours || "Data not available"}
                </p>
              </div>
            </div>

            {/* Social Media Links Section */}
            {(settings?.instagram || settings?.facebook || settings?.youtube) && (
              <div className="flex items-center gap-3 mt-1 relative z-10">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading mr-1">Follow Us</span>
                {settings?.facebook && (
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-white border border-slate-200/80 hover:bg-primary hover:border-primary text-slate-500 hover:text-white flex items-center justify-center transition-premium shadow-sm"
                    aria-label="Facebook"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                    </svg>
                  </a>
                )}
                {settings?.instagram && (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-white border border-slate-200/80 hover:bg-primary hover:border-primary text-slate-500 hover:text-white flex items-center justify-center transition-premium shadow-sm"
                    aria-label="Instagram"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                )}
                {settings?.youtube && (
                  <a
                    href={settings.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-white border border-slate-200/80 hover:bg-primary hover:border-primary text-slate-500 hover:text-white flex items-center justify-center transition-premium shadow-sm"
                    aria-label="YouTube"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                )}
              </div>
            )}

            {/* Premium Curved Google Map Card integration */}
            <div className="bg-white/70 border border-slate-200/80 backdrop-blur-md p-2 rounded-[28px] shadow-md hover:border-primary/20 transition-premium overflow-hidden mt-0 sm:mt-2">
              <iframe
                title="Clinic Location"
                src={settings?.mapLink || "https://www.google.com/maps?q=Ahmedabad,Gujarat&output=embed"}
                className="w-full h-[250px] rounded-[22px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Appointment Form Workspace */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;