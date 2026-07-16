import "./TestimonialCard.css";

const TestimonialCard = ({ testimonial }) => {
  const rating = testimonial.rating || 5;
  const avatarUrl = testimonial.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.patientName)}&background=random&color=fff`;

  return (
    <article 
      className="testimonial-card glass-card p-8 rounded-3xl border border-slate-200/60 transition-premium hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/20 relative flex flex-col justify-between overflow-hidden min-h-[320px]"
      id={`testimonial-${testimonial._id}`}
    >
      {/* Large Background Quote Icon */}
      <div 
        className="absolute top-6 right-6 pointer-events-none z-0"
        style={{ color: "hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.04)" }}
      >
        <svg className="w-24 h-24 fill-currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.988zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Star Rating Row */}
        <div className="flex gap-1 text-amber-500 mb-6">
          {[...Array(5)].map((_, i) => (
            <svg 
              key={i} 
              className={`w-4 h-4 ${i < rating ? "fill-currentColor" : "stroke-current stroke-1 fill-none"}`} 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Content Paragraph */}
        <p className="text-sm sm:text-base text-secondary font-body italic leading-relaxed mb-8 relative pr-14">
          "{testimonial.content}"
        </p>
      </div>

      {/* Patient Profile Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200/60 relative z-10">
        <div className="flex items-center gap-4">
          {/* Rounded avatar */}
          <img 
            src={avatarUrl} 
            alt={testimonial.patientName} 
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
          />
          <div>
            <h4 className="font-bold text-sm text-secondary font-heading leading-tight">{testimonial.patientName}</h4>
            <p className="text-[11px] text-text-muted mt-0.5 font-medium uppercase tracking-wider">{testimonial.treatment || "General Rehab"}</p>
          </div>
        </div>

        {/* Verified Checkmark Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold tracking-wider uppercase shrink-0">
          <svg className="w-3 h-3 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Verified
        </div>
      </div>
    </article>
  );
};

export default TestimonialCard;