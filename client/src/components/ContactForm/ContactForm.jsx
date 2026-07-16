import "./ContactForm.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "../../validations/contactSchema";
import useContact from "../../hooks/useContact";

const ContactForm = () => {
  const { sendMessage } = useContact();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await sendMessage(data);
      reset();
    } catch {
      // Toast already handled
    }
  };

  return (
    <div className="bg-white/80 border border-slate-200/60 backdrop-blur-md rounded-[32px] p-6 sm:p-10 shadow-2xl relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-primary/5 blur-[50px] pointer-events-none" />

      {/* Header Description */}
      <div className="mb-8 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-secondary font-heading mb-2">Send Us a Message</h2>
        <p className="text-xs sm:text-sm text-text-muted font-body leading-relaxed">
          Fill out the check-in form below, and our staff will respond within 24 hours to coordinate scheduling.
        </p>
      </div>

      {/* Form Fields Workspace */}
      <form className="relative z-10" onSubmit={handleSubmit(onSubmit)}>
        
        {/* Name and Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4.5 py-3.5 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
              {...register("name")}
            />
            {errors.name && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide mt-1">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4.5 py-3.5 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
              {...register("email")}
            />
            {errors.email && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide mt-1">{errors.email.message}</p>}
          </div>
        </div>

        {/* Phone and Subject Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">Phone Number</label>
            <input
              type="text"
              placeholder="Enter your phone"
              className="w-full px-4.5 py-3.5 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
              {...register("phone")}
            />
            {errors.phone && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide mt-1">{errors.phone.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">Subject</label>
            <input
              type="text"
              placeholder="How can we help?"
              className="w-full px-4.5 py-3.5 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
              {...register("subject")}
            />
            {errors.subject && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide mt-1">{errors.subject.message}</p>}
          </div>
        </div>

        {/* Message Area */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">Your Message</label>
          <textarea
            rows="4"
            placeholder="Please describe your physical health symptoms or booking requests..."
            className="w-full px-4.5 py-3.5 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm resize-none"
            {...register("message")}
          />
          {errors.message && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide mt-1">{errors.message.message}</p>}
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{ cursor: isSubmitting ? "wait" : "pointer" }}
          className={`w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-premium cursor-pointer ${
            isSubmitting
              ? "bg-slate-100 text-slate-400 border border-slate-200"
              : "bg-primary hover:bg-primary/95 text-white border border-primary shadow-lg shadow-primary/10 hover:shadow-primary/25 hover:scale-[1.01]"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              Sending Request...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send Clinical Request
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default ContactForm;