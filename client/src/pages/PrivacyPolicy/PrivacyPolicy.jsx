import { Link } from "react-router-dom";
import { useBranding } from "../../context/BrandingContext";
import { FaShieldAlt, FaRegClock, FaArrowLeft, FaChevronRight } from "react-icons/fa";
import { useEffect } from "react";

const PrivacyPolicy = () => {
  const { settings } = useBranding();
  const clinicName = settings?.name || "PhysioCare";

  const sections = [
    { id: "collect", title: "1. Information We Collect" },
    { id: "use", title: "2. How We Use Information" },
    { id: "share", title: "3. Information Sharing" },
    { id: "security", title: "4. Data Security" },
    { id: "rights", title: "5. Your Privacy Rights" },
    { id: "cookies", title: "6. Cookies & Tracking" },
    { id: "changes", title: "7. Policy Updates" },
  ];

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-bg-offwhite bg-grid-blueprint relative pt-5 lg:pt-10 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background glowing lights */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-primary-glow/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-glow/10 blur-[90px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Back navigation cap */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary transition-colors mb-8 cursor-pointer group"
        >
          <FaArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </Link>

        {/* Cinematic Header Block */}
        <div className="text-left mb-12">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-md mb-5 animate-pulse">
            <FaShieldAlt className="w-3.5 h-3.5" />
            Security & Trust
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-secondary font-heading leading-tight mb-4">
            Privacy Policy
          </h1>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <FaRegClock className="w-4 h-4 shrink-0" />
            <span>Last Updated: July 2026</span>
            <span className="text-slate-300">|</span>
            <span>{clinicName} Patient Agreement</span>
          </div>
        </div>

        {/* Content Split Pane Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* Sticky Left Navigation Panel */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white/80 border border-slate-200/60 backdrop-blur-md rounded-2xl p-5 shadow-sm flex flex-col gap-1">
              <span className="font-heading text-xs font-bold uppercase tracking-wider text-secondary/50 mb-3 px-2">
                Agreement Sections
              </span>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleScroll(section.id)}
                  className="flex items-center justify-between text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-primary hover:bg-primary/5 transition-all cursor-pointer group"
                >
                  <span>{section.title}</span>
                  <FaChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all text-primary shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Policy Text (Right side) */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            <div className="bg-white/85 border border-slate-200/60 backdrop-blur-md rounded-[32px] p-6 sm:p-10 shadow-lg text-left">

              {/* Introduction */}
              <div className="prose max-w-none text-slate-600 font-body text-sm sm:text-base leading-relaxed mb-8">
                <p className="mb-4">
                  At <strong>{clinicName}</strong>, we are committed to safeguarding the privacy and security of our patients' personal and medical data. This Privacy Policy details how we collect, store, utilize, and protect your information when you interact with our website, clinic portals, or receive physical therapy treatments.
                </p>
                <p>
                  By scheduling an appointment, registering an account on our patient portal, or using any services provided by {clinicName}, you consent to the data collection and usage practices described in this agreement.
                </p>
              </div>

              {/* Policy Sections */}
              <div className="flex flex-col gap-10">

                {/* Section 1 */}
                <section id="collect" className="scroll-mt-24 border-t border-slate-100 pt-8">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-secondary mb-4">
                    1. Information We Collect
                  </h2>
                  <div className="text-slate-600 font-body text-sm leading-relaxed flex flex-col gap-3">
                    <p>
                      To provide professional clinical diagnostics, manual rehabilitation therapies, and patient portal access, we collect the following categories of information:
                    </p>
                    <ul className="list-disc pl-5 flex flex-col gap-2">
                      <li><strong>Personal Coordinates</strong>: Full name, date of birth, gender, email address, physical mailing address, and contact numbers.</li>
                      <li><strong>Clinical Records</strong>: Medical histories, injury reports, active symptom charts, physiotherapist assessment logs, and custom recovery plan outlines.</li>
                      <li><strong>Account Metadata</strong>: Log-in credentials, profile avatars, security passwords, and account creation logs.</li>
                      <li><strong>Usage Metrics</strong>: Browser configurations, diagnostic analytics, IP addresses, and cookie trackers.</li>
                    </ul>
                  </div>
                </section>

                {/* Section 2 */}
                <section id="use" className="scroll-mt-24 border-t border-slate-100 pt-8">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-secondary mb-4">
                    2. How We Use Your Information
                  </h2>
                  <div className="text-slate-600 font-body text-sm leading-relaxed flex flex-col gap-3">
                    <p>
                      We process patient records in compliance with medical privacy laws. Your information is used for:
                    </p>
                    <ul className="list-disc pl-5 flex flex-col gap-2">
                      <li>Delivering tailored manual treatments, exercise programs, and clinical checkups.</li>
                      <li>Operating the online Patient Portal, letting you download exercise sheets and submit testimonial reviews.</li>
                      <li>Scheduling appointments, managing invoices, and issuing contact message responses.</li>
                      <li>Improving our website performance, layout visual aesthetics, and portal security levels.</li>
                    </ul>
                  </div>
                </section>

                {/* Section 3 */}
                <section id="share" className="scroll-mt-24 border-t border-slate-100 pt-8">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-secondary mb-4">
                    3. Information Sharing
                  </h2>
                  <div className="text-slate-600 font-body text-sm leading-relaxed flex flex-col gap-3">
                    <p>
                      {clinicName} enforces strict data isolation. We do not sell, rent, or trade patient personal details. Information sharing is capped at:
                    </p>
                    <ul className="list-disc pl-5 flex flex-col gap-2">
                      <li><strong>Medical Consent</strong>: Sharing reports with your primary physician or orthopedic surgeon upon your explicit written request.</li>
                      <li><strong>Cloud Infrastructure</strong>: Sharing account avatars or files with encrypted storage partners (e.g. database and cloud file drives) strictly for portal operations.</li>
                      <li><strong>Legal Compliance</strong>: Releasing details under court orders, warrants, or medical audits.</li>
                    </ul>
                  </div>
                </section>

                {/* Section 4 */}
                <section id="security" className="scroll-mt-24 border-t border-slate-100 pt-8">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-secondary mb-4">
                    4. Data Security
                  </h2>
                  <div className="text-slate-600 font-body text-sm leading-relaxed flex flex-col gap-3">
                    <p>
                      We deploy high-grade security protocols to prevent unauthorized access, alteration, or leakage of your medical records.
                    </p>
                    <p>
                      All database queries run over secure SSL connections, patient profile passwords are encrypted using bcrypt hashing systems, and cloud file uploads utilize encrypted links. However, please remember that no web storage or transaction channel is 100% immune to leaks, so protect your portal login credentials accordingly.
                    </p>
                  </div>
                </section>

                {/* Section 5 */}
                <section id="rights" className="scroll-mt-24 border-t border-slate-100 pt-8">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-secondary mb-4">
                    5. Your Privacy Rights
                  </h2>
                  <div className="text-slate-600 font-body text-sm leading-relaxed flex flex-col gap-3">
                    <p>
                      You retain full ownership of your data. Depending on your local health coordinates legislation, you have the right to:
                    </p>
                    <ul className="list-disc pl-5 flex flex-col gap-2">
                      <li>Request a digital copy of all medical histories and account information we store.</li>
                      <li>Correct inaccurate mailing details, phone numbers, or profile coordinates.</li>
                      <li>Request the permanent deletion of your patient portal account and contact history.</li>
                      <li>Withdraw consent for publishing testimonial recovery reviews on our public Wall of Love.</li>
                    </ul>
                  </div>
                </section>

                {/* Section 6 */}
                <section id="cookies" className="scroll-mt-24 border-t border-slate-100 pt-8">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-secondary mb-4">
                    6. Cookies & Tracking
                  </h2>
                  <div className="text-slate-600 font-body text-sm leading-relaxed flex flex-col gap-3">
                    <p>
                      Our website utilizes tracking cookies and token storage elements to keep you authenticated inside the Patient Dashboard and Admin Panel, remember layout preferences, and gather anonymous visitor analytics.
                    </p>
                    <p>
                      You can adjust your browser settings to reject cookies, though doing so might disable login workflows and patient database features.
                    </p>
                  </div>
                </section>

                {/* Section 7 */}
                <section id="changes" className="scroll-mt-24 border-t border-slate-100 pt-8">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-secondary mb-4">
                    7. Policy Updates
                  </h2>
                  <div className="text-slate-600 font-body text-sm leading-relaxed">
                    <p>
                      We reserve the right to modify this Privacy Policy. We will update the "Last Updated" timestamp at the top of this page whenever modifications occur. We encourage you to review this agreement periodically to stay informed about how we safeguard patient data.
                    </p>
                  </div>
                </section>

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
