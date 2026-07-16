import "./CTA.css";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="relative px-6 lg:px-16 py-15 sm:py-28 bg-white border-t border-b border-slate-200/50 overflow-hidden text-center">
      {/* Grid background overlay */}
      <div className="absolute inset-0 bg-grid-blueprint opacity-[0.06] pointer-events-none z-0" />
      
      {/* Background ambient glowing light */}
      <div className="absolute top-1/2 left-1/2 w-[550px] h-[300px] rounded-full bg-primary-glow/15 blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0 animate-pulse-glow" />

      {/* Background anatomy skeletal illustration */}
      <div className="absolute right-[10%] bottom-[-20%] w-[320px] h-[480px] text-primary/[0.04] pointer-events-none z-0">
        <svg viewBox="0 0 100 150" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="0.8">
          <path d="M50,5 L50,145" strokeDasharray="2,2" />
          {/* Ribcage Outline */}
          <path d="M50,15 C25,22 20,45 38,62" />
          <path d="M50,15 C75,22 80,45 62,62" />
          <path d="M50,25 C20,33 15,60 38,75" />
          <path d="M50,25 C80,33 85,60 62,75" />
          <path d="M50,37 C15,47 10,75 38,90" />
          <path d="M50,37 C85,47 90,75 62,90" />
          <path d="M50,51 C10,63 5,90 38,105" />
          <path d="M50,51 C90,63 95,90 62,105" />
          {/* Vertebrae notches */}
          <line x1="47" y1="12" x2="53" y2="12" />
          <line x1="46" y1="22" x2="54" y2="22" />
          <line x1="45" y1="34" x2="55" y2="34" />
          <line x1="44" y1="48" x2="56" y2="48" />
          <line x1="43" y1="64" x2="57" y2="64" />
          <line x1="43" y1="82" x2="57" y2="82" />
          <line x1="44" y1="102" x2="56" y2="102" />
          <line x1="45" y1="124" x2="55" y2="124" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto z-10">
      
        <span className="inline-block text-secondary text-xs font-bold tracking-wider uppercase mb-3 font-accent">
            Ready to Start Your
          </span>
          <h2 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-3xl sm:text-4xl md:text-5.5xl font-bold tracking-tight text-transparent font-heading">
            Recovery Journey?
          </h2>

        {/* Paragraph */}
        <p className="text-sm sm:text-base md:text-lg text-slate-500 font-body leading-relaxed max-w-lg mx-auto mt-4 mb-10">
          Book your consultation today and take the first step toward a healthier, pain-free life. Our therapists are ready to help you thrive.
        </p>

        {/* CTA Button */}
        <div>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2.5 px-9 py-4 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/35 transition-premium cursor-pointer text-sm sm:text-base border border-primary/20"
          >
            Contact Us
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;