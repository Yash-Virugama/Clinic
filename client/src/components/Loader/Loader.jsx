import "./Loader.css";

const Loader = ({ fullPage = true }) => {
  return (
    <div className={`flex flex-col items-center justify-center relative overflow-hidden bg-slate-50/90 ${fullPage ? 'h-screen w-screen fixed inset-0 z-50' : 'h-full w-full py-12'}`}>
      
      {/* Background Page Skeleton (Simulating Clinic Portal) */}
      <div className="absolute inset-0 w-full h-full p-6 flex flex-col gap-6 opacity-35 pointer-events-none select-none">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center w-full pb-4 border-b border-slate-200 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200" />
            <div className="w-28 h-4 rounded-lg bg-slate-200" />
          </div>
          <div className="flex gap-4">
            <div className="w-16 h-8 rounded-lg bg-slate-200" />
            <div className="w-16 h-8 rounded-lg bg-slate-200" />
            <div className="w-16 h-8 rounded-lg bg-slate-200" />
          </div>
        </div>

        {/* Hero Section Skeleton */}
        <div className="w-full h-44 rounded-3xl bg-slate-200 animate-pulse" />

        {/* Card Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-slate-200 rounded-3xl p-5 flex flex-col gap-4 bg-white animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-slate-200" />
              <div className="w-3/4 h-4 rounded bg-slate-200" />
              <div className="flex flex-col gap-2">
                <div className="w-full h-3 rounded bg-slate-200" />
                <div className="w-5/6 h-3 rounded bg-slate-200" />
                <div className="w-2/3 h-3 rounded bg-slate-200" />
              </div>
              <div className="mt-auto w-24 h-8 rounded-lg bg-slate-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Unique Floating Glassmorphism Loader Card */}
      <div className="relative z-10 p-8 max-w-sm w-11/12 mx-auto bg-white/70 backdrop-blur-[12px] border border-white/60 rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.06)] text-center flex flex-col items-center gap-6 animate-page-entrance">
        {/* Double-Ring Neutral Loader */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-200/55 border-t-slate-600 animate-spin" />
          {/* Inner ring (spins opposite direction) */}
          <div className="absolute w-10 h-10 rounded-full border-4 border-slate-200/55 border-b-slate-500 animate-[spin_1s_linear_infinite_reverse]" />
          {/* Core dot */}
          <div className="w-3.5 h-3.5 rounded-full bg-slate-400 animate-ping" />
        </div>

        {/* Loading Description */}
        <div className="flex flex-col gap-2.5">
          <h5 className="font-heading text-sm font-bold text-slate-700 tracking-tight">
            Preparing Portal
          </h5>
          <div className="w-32 h-1 bg-slate-200/80 rounded-full mx-auto overflow-hidden relative">
            <div className="h-full bg-slate-450 absolute top-0 left-0 rounded-full animate-loading-bar" style={{ width: '40%' }} />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-slate-450 font-accent uppercase animate-pulse">
            Syncing workspace...
          </span>
        </div>
      </div>

    </div>
  );
};

export default Loader;
