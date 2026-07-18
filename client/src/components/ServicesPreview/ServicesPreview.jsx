import "./ServicesPreview.css";
import { Link } from "react-router-dom";
import useServices from "../../hooks/useServices";

// Helper component to render modern medical SVG artwork based on service title
const ServicesPreview = () => {
  const { services, loading } = useServices();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-bg-white bg-grid-blueprint">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-muted text-sm font-semibold tracking-wide mt-4 font-accent">Loading clinical services...</p>
      </div>
    );
  }

  return (
    <section className="relative px-6 lg:px-16 py-15 sm:py-24 bg-bg-white overflow-hidden bg-grid-blueprint">
      <div className="max-w-7xl mx-auto z-10 relative">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-18">
          <span className="inline-block text-primary text-xs font-bold tracking-wider uppercase mb-3 font-accent">
            What We Treat
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5.5xl font-bold tracking-tight text-secondary font-heading">
            Our Services
          </h2>
          <p className="text-sm sm:text-base text-text-muted mt-4 font-body">
            Specialized, evidence-based treatments designed to restore movement, eliminate chronic pain, and rebuild strength.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {services.slice(0, 3).map((service) => (
            <Link 
              to={`/services#service-${service._id}`}
              className="glass-card p-6 sm:p-10 lg:p-6 rounded-3xl border border-secondary/10 shadow-md hover:border-primary hover:shadow-xl transition-premium hover:-translate-y-2 group cursor-pointer flex flex-col justify-between gap-8 min-h-[440px] block no-underline" 
              style={{
                background: "radial-gradient(120% 120% at 50% 0%, hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.08) 0%, rgba(255, 255, 255, 0.6) 60%, rgba(255, 255, 255, 0.95) 100%)"
              }}
              key={service._id}
            >
              <div>
                {/* Uploaded Service Image Container */}
                {service.image && (
                  <div className="w-full aspect-video rounded-2xl overflow-hidden mb-6 bg-slate-100 border border-slate-100/50 relative z-10">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-premium"
                    />
                  </div>
                )}

                {/* Service Text */}
                <h3 className="text-xl sm:text-2xl font-bold text-secondary font-heading mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-text-muted font-body leading-relaxed line-clamp-3">
                  {service.description}
                </p>
              </div>

              {/* Static View Details indicator to give premium UX */}
              <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-primary lg:opacity-0 lg:group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-premium pt-4">
                Learn More
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA Link */}
        <div className="text-center">
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-hover hover:shadow-xl transition-premium cursor-pointer text-sm sm:text-base"
          >
            View All Services
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;