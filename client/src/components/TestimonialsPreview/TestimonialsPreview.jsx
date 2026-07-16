import "./TestimonialsPreview.css";
import { Link } from "react-router-dom";
import useTestimonials from "../../hooks/useTestimonials";

// Helper function to return beautiful avatars
const getPatientDetails = (name = "", index = 0) => {
  const lowercaseName = name.toLowerCase();
  
  if (lowercaseName.includes("priya")) {
    return {
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120"
    };
  }
  if (lowercaseName.includes("rahul")) {
    return {
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120"
    };
  }
  if (lowercaseName.includes("neha")) {
    return {
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120&h=120"
    };
  }
  
  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120"
  ];
  
  return {
    avatar: avatars[index % avatars.length]
  };
};

const TestimonialsPreview = () => {
  const { testimonials, loading } = useTestimonials();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-bg-offwhite bg-dot-matrix">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-muted text-sm font-semibold tracking-wide mt-4 font-accent">Loading patient testimonials...</p>
      </div>
    );
  }

  return (
    <section className="relative px-6 lg:px-16 py-15 sm:py-24 bg-bg-offwhite overflow-hidden bg-dot-matrix">
      {/* Background ambient lighting */}
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] rounded-full bg-accent-glow blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto z-10 relative">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-18">
          <span className="inline-block text-primary text-xs font-bold tracking-wider uppercase mb-3 font-accent">
            Patient Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5.5xl font-bold tracking-tight text-secondary font-heading">
            What Our Patients Say
          </h2>
          <p className="text-sm sm:text-base text-text-muted mt-4 font-body">
            Read about the recovery journeys and transformations of patients who restored their health at our clinic.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.slice(0, 3).map((testimonial, idx) => {
            const details = getPatientDetails(testimonial.patientName, idx);
            const rating = testimonial.rating || 5;
            const avatar = testimonial.user?.image || details.avatar;

            return (
              <div 
                className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/60 transition-premium hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/20 relative flex flex-col justify-between overflow-hidden" 
                key={testimonial._id}
              >
                {/* Large Background Quote Icon */}
                <div 
                  className="absolute top-6 right-6 pointer-events-none z-0"
                  style={{ color: "hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.04)" }}
                >
                  <svg className="w-20 h-20 sm:w-24 sm:h-24 fill-currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

                  {/* Testimonial Content */}
                  <p className="text-sm sm:text-base text-secondary font-body italic leading-relaxed mb-4 relative pr-23 sm:pr-25">
                    {testimonial.content.length > 50 ? (
                      <>
                        "{testimonial.content.substring(0, 50)}..."{" "}
                        <Link 
                          to={`/testimonials#testimonial-${testimonial._id}`} 
                          className="text-primary font-semibold hover:underline not-italic inline-block text-xs"
                        >
                          Read More
                        </Link>
                      </>
                    ) : (
                      `"${testimonial.content}"`
                    )}
                  </p>
                </div>

                {/* Patient Profile Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-200/60 relative z-10">
                  <div className="flex items-center gap-4">
                    {/* Rounded avatar */}
                    <img 
                      src={avatar} 
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
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Link */}
        <div className="text-center">
          <Link 
            to="/testimonials" 
            className="inline-flex items-center gap-2 text-primary font-bold text-sm tracking-wide uppercase hover:text-primary-hover group transition-colors"
          >
            View All Testimonials
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsPreview;