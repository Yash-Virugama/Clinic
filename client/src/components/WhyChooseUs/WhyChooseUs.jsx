import "./WhyChooseUs.css";

const WhyChooseUs = () => {
  const steps = [
    {
      number: "1",
      title: "Assessment",
      description: "Thorough clinical examination, movement mapping, and physical evaluation to understand your condition.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
        </svg>
      )
    },
    {
      number: "2",
      title: "Diagnosis",
      description: "Identifying the root source of pain, nerve restrictions, muscle tension, or structural deficits.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      )
    },
    {
      number: "3",
      title: "Treatment",
      description: "Personalized therapy using advanced manual techniques, trigger adjustments, and clinical exercises.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      )
    },
    {
      number: "4",
      title: "Recovery",
      description: "Post-therapy care, strength training guidance, and wellness checks for long-term health.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    }
  ];

  return (
    <section className="relative px-6 lg:px-16 py-15 sm:py-24 bg-bg-offwhite overflow-hidden bg-dot-matrix">
      {/* Subtle organic light gradient backgrounds */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[300px] rounded-full bg-primary-glow blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto z-10 relative">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-18">
          <span className="inline-block text-primary text-xs font-bold tracking-wider uppercase mb-3 font-accent">
            Our Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5.5xl font-bold tracking-tight text-secondary font-heading">
            Your Recovery Timeline
          </h2>
          <p className="text-sm sm:text-base text-text-muted mt-4 font-body">
            A comprehensive, patient-centered clinical pathway focused on permanent recovery and high physical performance.
          </p>
        </div>

        {/* Timeline Path container */}
        <div className="relative mt-12">
          {/* Animated Connecting Line for Desktop */}
          <div className="absolute top-[48px] left-[12%] right-[12%] h-[2px] bg-slate-200/80 hidden md:block z-0">
            <div className="h-full bg-gradient-to-r from-primary via-accent to-primary w-full origin-left animate-[draw-line_2s_ease-out_forwards] scale-x-100" />
          </div>

          {/* Timeline Nodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                {/* Node circle */}
                <div className="w-24 h-24 rounded-full glass-card backdrop-blur-[16px] flex items-center justify-center text-primary border border-white/60 shadow-md relative z-10 transition-premium group-hover:scale-110 group-hover:border-primary/40 group-hover:text-primary-hover group-hover:shadow-lg mb-6 cursor-pointer">
                  {/* Step step number badge */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                    {step.number}
                  </div>
                  {step.icon}
                </div>

                {/* Step Content */}
                <h3 className="text-xl font-bold text-secondary font-heading mb-3 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;