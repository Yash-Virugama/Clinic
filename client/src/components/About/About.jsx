import "./About.css";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className="relative px-6 lg:px-16 py-15 sm:py-24 bg-bg-white overflow-hidden bg-grid-blueprint">
      {/* Background blueprint skeleton line-art (low opacity spine illustration) */}
      <div className="absolute left-[5%] top-1/2 -translate-y-1/2 w-[350px] h-[550px] text-primary/[0.03] pointer-events-none z-0">
        <svg viewBox="0 0 100 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="0.8">
          {/* Detailed Spine Outline */}
          <path d="M50,10 L50,190" strokeDasharray="3,3" />
          {/* Vertebrae details */}
          <path d="M45,20 L55,20" />
          <path d="M43,28 L57,28 Q50,32 43,28" fill="none" />
          <path d="M42,38 L58,38 Q50,42 42,38" fill="none" />
          <path d="M40,48 L60,48 Q50,53 40,48" fill="none" />
          <path d="M38,59 L62,59 Q50,65 38,59" fill="none" />
          <path d="M36,71 L64,71 Q50,78 36,71" fill="none" />
          <path d="M35,84 L65,84 Q50,91 35,84" fill="none" />
          <path d="M34,98 L66,98 Q50,105 34,98" fill="none" />
          <path d="M34,113 L66,113 Q50,121 34,113" fill="none" />
          <path d="M35,129 L65,129 Q50,138 35,129" fill="none" />
          <path d="M36,146 L64,146 Q50,155 36,146" fill="none" />
          <path d="M38,164 L62,164 Q50,173 38,164" fill="none" />
          
          {/* Ribcage hint */}
          <path d="M43,28 C20,35 15,65 35,84" />
          <path d="M57,28 C80,35 85,65 65,84" />
          <path d="M42,38 C15,46 10,80 34,98" />
          <path d="M58,38 C85,46 90,80 66,98" />
          <path d="M40,48 C10,58 5,95 34,113" />
          <path d="M60,48 C90,58 95,95 66,113" />
          <path d="M38,59 C5,72 2,110 35,129" />
          <path d="M62,59 C95,72 98,110 65,129" />

          {/* Pelvis Outline */}
          <path d="M30,165 C30,150 70,150 70,165 C70,185 55,190 50,195 C45,190 30,185 30,165 Z" />
          <circle cx="38" cy="172" r="5" />
          <circle cx="62" cy="172" r="5" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 z-10">
        {/* Left Side Content */}
        <div className="w-full lg:w-1/2">
          {/* Section Badge */}
          <span className="inline-block text-primary text-xs font-bold tracking-wider uppercase mb-3 font-accent">
            About Our Clinic
          </span>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-secondary font-heading leading-tight mb-6">
            Helping You Recover,<br />
            <span className="text-primary">Move Freely</span>, and Live Pain-Free.
          </h2>

          {/* Paragraph */}
          <p className="text-base sm:text-lg text-text-muted font-body leading-relaxed mb-8 max-w-xl">
            We provide personalized physiotherapy treatments for sports injuries, chronic pain, post-surgical rehabilitation, and mobility improvement using evidence-based techniques. Our approach is dedicated to restoring biological function and building long-term physical resilience.
          </p>

          {/* Learn More link styled as a luxury text-link button */}
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 text-primary font-bold text-sm tracking-wide uppercase hover:text-primary-hover group transition-colors"
          >
            Learn More
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Right Side Feature Cards */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          {/* Card 1 */}
          <div className="glass-card p-6 sm:p-8 rounded-2.5xl border border-slate-200/50 transition-premium hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 flex gap-6 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-primary group-hover:text-white transition-premium">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-secondary font-heading mb-1.5">Holistic Assessment</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Advanced mobility mapping and biomechanical analysis to identify root causes rather than just treating symptoms.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-6 sm:p-8 rounded-2.5xl border border-slate-200/50 transition-premium hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 flex gap-6 group">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-accent group-hover:text-white transition-premium">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-secondary font-heading mb-1.5">Tailored Rehabilitation</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Customized treatment regimens designed specifically around your recovery goals, physical limits, and lifestyle.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-6 sm:p-8 rounded-2.5xl border border-slate-200/50 transition-premium hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 flex gap-6 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-premium">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-secondary font-heading mb-1.5">Continuous Support</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Ongoing recovery monitoring, clinical checks, and home exercise guidance to maintain long-term pain-free stability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;