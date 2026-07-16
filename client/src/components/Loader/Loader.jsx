import "./Loader.css";

const Loader = ({ fullPage = true }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${fullPage ? 'h-screen w-screen fixed inset-0 bg-slate-50 z-50' : 'h-full w-full py-12'}`}>
      <div className="relative flex flex-col items-center gap-6 animate-pulse-slow">
        {/* Animated medical shield/leaf logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-glow" />
          <svg className="w-16 h-16 relative text-primary animate-float" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 3.5C18 3.5 7 11.5 7 21.5C7 28.1274 12.3726 33.5 19 33.5C25.6274 33.5 31 28.1274 31 21.5C31 11.5 18 3.5 18 3.5Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 3.5V33.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
            <circle cx="18" cy="13" r="3.5" fill="var(--accent)" />
            <circle cx="12" cy="19.5" r="3" fill="currentColor" />
            <circle cx="24" cy="19.5" r="3" fill="currentColor" />
            <circle cx="18" cy="26" r="3.5" fill="var(--accent)" />
          </svg>
        </div>
        
        {/* Sleek loading bar/spinner */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-48 h-1.5 bg-slate-200/80 rounded-full overflow-hidden relative">
            <div className="h-full bg-gradient-to-r from-primary to-accent absolute top-0 left-0 rounded-full animate-loading-bar" style={{ width: '40%' }} />
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
