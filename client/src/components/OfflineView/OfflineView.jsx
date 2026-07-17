import { FaWifi } from "react-icons/fa";

const OfflineView = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8 relative overflow-hidden w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px] pointer-events-none z-0" />
      <div className="relative z-10 max-w-[420px] w-full bg-white/70 backdrop-blur-[16px] border border-white/60 rounded-[24px] p-10 text-center shadow-md animate-page-entrance">
        <div className="w-[70px] h-[70px] rounded-[18px] bg-primary/8 flex items-center justify-center text-primary mx-auto mb-6 animate-float">
          <FaWifi className="w-8 h-8 text-primary" />
        </div>
        <div>
          <div className="inline-block px-2.5 py-1 rounded-lg bg-red-500/8 text-red-500 text-[10px] font-bold uppercase tracking-wider mb-4 font-accent">
            Offline Mode
          </div>
          <h1 className="font-heading text-xl font-bold text-secondary mb-2.5">
            Connection Lost
          </h1>
          <p className="font-body text-xs text-text-muted leading-relaxed mb-7">
            It looks like you're currently disconnected from the internet. Please check your network settings and try reloading.
          </p>
          <button className="inline-flex items-center justify-center w-full py-3 px-6 bg-primary hover:bg-primary-hover text-white font-accent text-[13px] font-semibold rounded-xl shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={handleReload}>
            Try Again
          </button>
        </div>
        <div className="font-body text-xs text-text-muted mt-6 opacity-85">
          You can still access precached sections of our app.
        </div>
      </div>
    </div>
  );
};

export default OfflineView;
