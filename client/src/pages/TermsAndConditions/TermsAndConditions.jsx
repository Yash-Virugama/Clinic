import { Link } from "react-router-dom";
import { useBranding } from "../../context/BrandingContext";
import { FaFileSignature, FaRegClock, FaArrowLeft, FaChevronRight } from "react-icons/fa";
import { useEffect } from "react";

const TermsAndConditions = () => {
  const { settings } = useBranding();
  const clinicName = settings?.name || "PhysioCare";

  const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms" },
    { id: "accounts", title: "2. Patient Accounts & Security" },
    { id: "medical", title: "3. Medical Disclaimer" },
    { id: "billing", title: "4. Appointments & Billing" },
    { id: "conduct", title: "5. Code of Conduct" },
    { id: "liability", title: "6. Limitation of Liability" },
    { id: "governing", title: "7. Governing Law" },
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
            <FaFileSignature className="w-3.5 h-3.5" />
            Terms of Service
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-secondary font-heading leading-tight mb-4">
            Terms & Conditions
          </h1>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <FaRegClock className="w-4 h-4 shrink-0" />
            <span>Last Updated: July 2026</span>
            <span className="text-slate-300">|</span>
            <span>{clinicName} General Agreement</span>
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

          {/* Detailed Terms Text (Right side) */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            <div className="bg-white/85 border border-slate-200/60 backdrop-blur-md rounded-[32px] p-6 sm:p-10 shadow-lg text-left">

              {/* Introduction */}
              <div className="prose max-w-none text-slate-600 font-body text-sm sm:text-base leading-relaxed mb-8">
                <p className="mb-4">
                  Welcome to <strong>{clinicName}</strong>. Please read these Terms & Conditions carefully before navigating our website, registering on our patient portals, or booking physical therapy treatments.
                </p>
                <p>
                  These terms govern your use of the website, patient drives, content feeds, and online services hosted by {clinicName}. By accessing the website or portal, you agree to be bound by these conditions. If you disagree with any part of these terms, please stop using our digital services immediately.
                </p>
              </div>

              {/* Terms Sections */}
              <div className="flex flex-col gap-10">

                {/* Section 1 */}
                <section id="acceptance" className="scroll-mt-24 border-t border-slate-100 pt-8">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-secondary mb-4">
                    1. Acceptance of Terms
                  </h2>
                  <div className="text-slate-600 font-body text-sm leading-relaxed">
                    <p>
                      By accessing this website, portal features, or subscribing to therapy notifications, you represent that you are at least 18 years of age and hold the legal capacity to enter into binding agreements. If you are under 18, you must obtain consent from a parent or guardian. We reserve the right to restrict account registration or site access to any user for violating these terms.
                    </p>
                  </div>
                </section>

                {/* Section 2 */}
                <section id="accounts" className="scroll-mt-24 border-t border-slate-100 pt-8">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-secondary mb-4">
                    2. Patient Accounts & Security
                  </h2>
                  <div className="text-slate-600 font-body text-sm leading-relaxed flex flex-col gap-3">
                    <p>
                      To download custom exercise files, update profile information, or write reviews, you must register a patient account.
                    </p>
                    <ul className="list-disc pl-5 flex flex-col gap-2">
                      <li>You must provide accurate, complete, and updated profile coordinates (name, email, age, and phone number).</li>
                      <li>You are solely responsible for protecting your account credentials and passwords.</li>
                      <li>You must notify us immediately of any security breach or unauthorized usage of your patient dashboard.</li>
                      <li>We reserve the right to suspend or terminate accounts that submit false credentials or violate patient standards.</li>
                    </ul>
                  </div>
                </section>

                {/* Section 3 */}
                <section id="medical" className="scroll-mt-24 border-t border-slate-100 pt-8">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-secondary mb-4">
                    3. Medical Disclaimer
                  </h2>
                  <div className="text-slate-600 font-body text-sm leading-relaxed flex flex-col gap-3">
                    <p className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-xl italic font-semibold text-secondary mb-2">
                      IMPORTANT: The digital documents, exercise guides, and articles published on this website are for informational and general education purposes only. They DO NOT constitute individual medical advice.
                    </p>
                    <p>
                      Never use online guides or documents to diagnose a medical condition or bypass a consultation with a licensed physiotherapist or orthopedic specialist. Always seek professional advice before starting any rehab programs, posture stretches, or physical training programs.
                    </p>
                  </div>
                </section>

                {/* Section 4 */}
                <section id="billing" className="scroll-mt-24 border-t border-slate-100 pt-8">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-secondary mb-4">
                    4. Appointments & Billing
                  </h2>
                  <div className="text-slate-600 font-body text-sm leading-relaxed flex flex-col gap-3">
                    <p>
                      When you submit an appointment booking request or inquiry through our website, you agree that:
                    </p>
                    <ul className="list-disc pl-5 flex flex-col gap-2">
                      <li>Bookings are subject to therapist availability and clinic verification.</li>
                      <li>Payments for treatments, evaluations, and therapy packages must follow clinic invoicing guidelines.</li>
                      <li>Cancellations or modifications to appointment slots should be submitted at least 24 hours in advance.</li>
                    </ul>
                  </div>
                </section>

                {/* Section 5 */}
                <section id="conduct" className="scroll-mt-24 border-t border-slate-100 pt-8">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-secondary mb-4">
                    5. Code of Conduct
                  </h2>
                  <div className="text-slate-600 font-body text-sm leading-relaxed flex flex-col gap-3">
                    <p>
                      When interacting with the {clinicName} patient portal, you agree not to:
                    </p>
                    <ul className="list-disc pl-5 flex flex-col gap-2">
                      <li>Upload malicious code, viruses, or script parameters that interfere with database operations.</li>
                      <li>Submit false reviews, spam inquiries, or abusive messages via contact forms.</li>
                      <li>Re-publish or distribute clinical exercise files or PDF resources to external websites for commercial gain.</li>
                    </ul>
                  </div>
                </section>

                {/* Section 6 */}
                <section id="liability" className="scroll-mt-24 border-t border-slate-100 pt-8">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-secondary mb-4">
                    6. Limitation of Liability
                  </h2>
                  <div className="text-slate-600 font-body text-sm leading-relaxed">
                    <p>
                      To the maximum extent permitted by law, {clinicName}, its clinical directors, therapists, and platform administrators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of the website or digital portal features, including any injuries resulting from the self-guided execution of downloadable exercise files.
                    </p>
                  </div>
                </section>

                {/* Section 7 */}
                <section id="governing" className="scroll-mt-24 border-t border-slate-100 pt-8">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-secondary mb-4">
                    7. Governing Law
                  </h2>
                  <div className="text-slate-600 font-body text-sm leading-relaxed">
                    <p>
                      These Terms & Conditions are governed by and construed in accordance with local healthcare and patient consumer protection laws. Any legal disputes arising from these terms or your clinical interactions shall be resolved exclusively in courts of competent jurisdiction.
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

export default TermsAndConditions;
