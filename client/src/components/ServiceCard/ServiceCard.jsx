import "./ServiceCard.css";

const ServiceCard = ({ service }) => {
  return (
    <article 
      className="service-card glass-card p-7 rounded-3.5xl border border-secondary/10 shadow-md hover:border-primary hover:shadow-xl transition-premium hover:-translate-y-2 group flex flex-col justify-between min-h-[460px] relative overflow-hidden"
      id={`service-${service._id}`}
      style={{
        background: "radial-gradient(120% 120% at 50% 0%, hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.08) 0%, rgba(255, 255, 255, 0.65) 50%, rgba(255, 255, 255, 0.95) 100%)"
      }}
    >
      <div>
        {/* Service Image */}
        <div className="w-full h-52 rounded-2.5xl overflow-hidden mb-6 bg-slate-100 border border-slate-100/50 relative z-10">
          {service.image ? (
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover group-hover:scale-103 transition-premium"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-text-muted italic bg-slate-50">
              No Clinical Image
            </div>
          )}
        </div>

        {/* Card Content */}
        <h3 className="text-xl sm:text-2xl font-bold text-secondary font-heading mb-3 group-hover:text-primary transition-colors">
          {service.title}
        </h3>

        <p className="text-sm text-text-muted font-body leading-relaxed line-clamp-4">
          {service.description}
        </p>
      </div>

      {/* Decorative arrow link at bottom */}
      <div className="flex justify-end pt-6 relative z-10">
        <div className="w-10 h-10 rounded-full border border-secondary/15 flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-premium transform group-hover:translate-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;