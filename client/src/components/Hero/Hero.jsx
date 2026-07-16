import "./Hero.css";
import { Link } from "react-router-dom";
import { useBranding } from "../../context/BrandingContext";
import clinicDoctorHero from "../../assets/images/clinic_doctor_hero.png";
import skeletonSvg from "../../assets/svg/Hero-skeleton.svg";

const Hero = () => {
  const { settings } = useBranding();
  const heroImageSrc = settings?.heroImage || clinicDoctorHero;
  return (
    <section className="relative min-h-[90vh] flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 px-6 lg:px-16 pt-10 lg:pt-5 pb-15 sm:pb-24 bg-bg-offwhite overflow-hidden bg-grid-blueprint">
      {/* Background ambient glowing lights */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-primary-glow blur-[100px] animate-pulse-glow -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] rounded-full bg-accent-glow blur-[80px] animate-pulse-glow pointer-events-none" />

      {/* Subtle Background Skeleton Watermark */}
      <div className="absolute left-260 top-0 w-[550px] h-[650px] opacity-[0.05] pointer-events-none z-0 translate-x-8 translate-y-8 select-none hidden lg:block">
        <img
          src={skeletonSvg}
          alt="Anatomical spine skeleton watermark"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Left side text content */}
      <div className="w-full lg:max-w-2xl z-10 flex flex-col text-left">
        {/* Capsule Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-md mb-4 mt-2 self-start animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Move Better. Live Better.
        </div>

        {/* Large Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-bold tracking-tight text-secondary font-heading leading-[1.1] mb-6">
          Expert Physiotherapy <br />
          for a <span className="bg-gradient-to-r from-primary via-primary-dark to-accent bg-clip-text text-transparent">Pain-Free Life</span>
        </h1>

        {/* Short Description */}
        <p className="text-base sm:text-lg text-text-muted font-body leading-relaxed max-w-lg mb-8">
          Personalized care, advanced rehabilitation techniques, and compassionate therapists to help you recover, restore movement, and thrive.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-12">
          <Link
            to="/contact" className="connect-us px-7 py-3.5 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/35 transition-premium flex items-center gap-2 group cursor-pointer text-sm sm:text-base">
            Contact Us
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
          <Link
            to="/services" className="explore px-7 py-3.5 bg-white/60 border border-slate-200 text-secondary font-semibold rounded-xl backdrop-blur-md hover:bg-white hover:border-slate-300 transition-premium cursor-pointer text-sm sm:text-base">
            Explore Services
          </Link>
        </div>

        {/* Experience Statistics */}
        <div className="grid grid-cols-3 gap-6 pt-4 sm:pt-8 border-t border-slate-200/80 max-w-md">
          <div className="flex flex-col gap-1">
            <span className="text-2xl sm:text-3.5xl font-bold text-secondary font-heading tracking-tight">5+ Yrs</span>
            <span className="text-[11px] sm:text-xs text-text-muted font-medium uppercase tracking-wider">Experience</span>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-2xl sm:text-3.5xl font-bold text-secondary font-heading tracking-tight">500+</span>
            <span className="text-[11px] sm:text-xs text-text-muted font-medium uppercase tracking-wider">Trusted Patients</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xl sm:text-3.5xl font-bold text-secondary font-heading tracking-tight">4.8/5</span>
            <span className="text-[11px] sm:text-xs text-text-muted font-medium uppercase tracking-wider">Patient Rating</span>
          </div>
        </div>
      </div>

      {/* Right Side Illustration - Hero Image and Floating Cards */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center z-10 pt-5 lg:py-0 sm:px-8">

        {/* Glow backdrop behind image */}
        <div className="absolute w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-primary/5 blur-[60px] pointer-events-none" />

        {/* Grid Background Overlay inside illustration */}
        <div className="absolute inset-0 bg-dot-matrix pointer-events-none opacity-20" />

        {/* Main curved image frame */}
        <div className="hero-image relative lg:right-20 lg:top-2 w-full max-h-[500px] max-w-[500px] aspect-[6/6] rounded-[36px] overflow-visible border border-white/80 bg-white/40 p-3 shadow-2xl animate-float">
          <img
            src={heroImageSrc}
            alt="Physiotherapist in modern clinic"
            className="w-full h-full object-cover rounded-[28px] shadow-inner"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;