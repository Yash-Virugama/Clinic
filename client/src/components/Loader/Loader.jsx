import "./Loader.css";

const Loader = ({ fullPage = true }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${fullPage ? 'h-screen w-screen fixed inset-0 bg-slate-50 z-50' : 'h-full w-full py-12'}`}>
      <div className="relative flex flex-col items-center gap-6 animate-pulse-slow">
        {/* Animated medical shield/leaf logo */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-xl animate-pulse-glow"/>
          <svg className="w-16 h-16 relative animate-float" style={{ color: 'var(--darkblue)' }} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shoulder line */}
            <path d="M11 9C14 7.5 15 7 18 7C21 7 22 7.5 25 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            
            {/* Spine column line */}
            <path d="M18 9V29" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            
            {/* Vertebrae segments */}
            <path d="M14 13H22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M13 17H23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12 21H24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M13 25H23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            
            {/* Pelvic base line */}
            <path d="M10 29C13 30.5 15 31 18 31C21 31 23 30.5 26 29" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            
            {/* Glowing joint indicators (using original accent/primary dots) */}
            <circle cx="18" cy="11.5" r="2.5" fill="#8e95a0" />
            <circle cx="18" cy="27" r="2.5" fill="#8e95a0" />
          </svg>
        </div>
        
        {/* Sleek loading bar/spinner */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-48 h-1.5 bg-slate-200/80 rounded-full overflow-hidden relative">
            <div className="h-full absolute top-0 left-0 rounded-full animate-loading-bar" style={{ backgroundImage: 'linear-gradient(to right, var(--darkblue), #8e95a0)', width: '40%' }} />
          </div>
          <span className="text-xs font-semibold tracking-wider text-slate-500 font-accent uppercase animate-pulse">
            Loading clinic portal...
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
