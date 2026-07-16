import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import useMyTestimonials from "../../../hooks/useMyTestimonials";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";

const DashboardTestimonials = () => {
  const {
    testimonials,
    loading,
    fetchTestimonials,
  } = useMyTestimonials();

  const [saving, setSaving] = useState(false);

  const formSchema = z.object({
    content: z
      .string()
      .trim()
      .min(10, "Testimonial must be at least 10 characters.")
      .max(1000, "Testimonial cannot exceed 1000 characters."),
    rating: z.coerce
      .number()
      .min(1)
      .max(5)
      .default(5),
    treatmentType: z.string().min(1, "Please select a treatment."),
    customTreatment: z.string().optional(),
  }).refine((data) => {
    if (data.treatmentType === "Other") {
      return data.customTreatment && data.customTreatment.trim().length >= 3;
    }
    return true;
  }, {
    message: "Custom treatment name must be at least 3 characters.",
    path: ["customTreatment"],
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      rating: 5,
      treatmentType: "Spinal Rehabilitation",
      customTreatment: "",
    }
  });

  const selectedTreatmentType = watch("treatmentType");

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const treatment = data.treatmentType === "Other" ? data.customTreatment : data.treatmentType;

      const res = await api.post("/testimonials", {
        content: data.content,
        rating: data.rating,
        treatment,
      });

      toast.success(res.data.message || "Feedback submitted successfully.");

      reset({
        content: "",
        rating: 5,
        treatmentType: "Spinal Rehabilitation",
        customTreatment: "",
      });

      await fetchTestimonials();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to submit testimonial."
      );
    } finally {
      setSaving(false);
    }
  };

  const ratingOptions = [
    { value: 5, label: "5 Stars" },
    { value: 4, label: "4 Stars" },
    { value: 3, label: "3 Stars" },
    { value: 2, label: "2 Stars" },
    { value: 1, label: "1 Star" }
  ];

  const treatmentOptions = [
    { value: "Spinal Rehabilitation", label: "Spinal Rehabilitation" },
    { value: "Sports Physiotherapy", label: "Sports Physiotherapy" },
    { value: "Post-Surgical Rehab", label: "Post-Surgical Rehab" },
    { value: "Orthopedic Physiotherapy", label: "Orthopedic Physiotherapy" },
    { value: "Pediatric Physiotherapy", label: "Pediatric Physiotherapy" },
    { value: "Geriatric Care", label: "Geriatric Care" },
    { value: "Neurological Rehabilitation", label: "Neurological Rehabilitation" },
    { value: "Other", label: "Other (please specify below)" }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-450 font-accent">
          Loading your testimonials...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left max-w-4xl mx-auto overflow-visible">

      {/* Header Info */}
      <div>
        <span className="inline-block text-primary text-[10px] font-bold tracking-wider uppercase mb-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 font-accent animate-pulse">
          Patient Feedback
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-secondary font-heading mb-2">
          My Testimonial Logs
        </h1>
        <p className="text-xs sm:text-sm text-text-muted font-body leading-relaxed max-w-l">
          Share your recovery experience with our therapists to help others starting their rehabilitation journeys.
        </p>
      </div>

      {/* Grid: Form Card & Testimonials list */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start overflow-visible">

        {/* Form Card (col-span-5) */}
        <div className="md:col-span-5 bg-white border border-slate-200/70 rounded-[28px] p-6 shadow-sm overflow-visible">
          <h3 className="text-sm font-bold text-secondary tracking-tight font-heading mb-5">
            Submit New Feedback
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4.5">

            {/* Rating */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">Star Rating</label>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={ratingOptions}
                    placeholder="Select Rating"
                  />
                )}
              />
              {errors.rating && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{errors.rating.message}</p>}
            </div>

            {/* Treatment type */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">Treatment Program</label>
              <Controller
                name="treatmentType"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={treatmentOptions}
                    placeholder="Select Treatment"
                  />
                )}
              />
              {errors.treatmentType && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{errors.treatmentType.message}</p>}
            </div>

            {/* Specify Custom Treatment */}
            {selectedTreatmentType === "Other" && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">Specify Treatment</label>
                <input
                  type="text"
                  placeholder="e.g. Cardiopulmonary Therapy..."
                  {...register("customTreatment")}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
                />
                {errors.customTreatment && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{errors.customTreatment.message}</p>}
              </div>
            )}

            {/* Content text */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">Share Experience</label>
              <textarea
                rows={4}
                placeholder="Describe your recovery and how the therapist guided your checklist exercises..."
                {...register("content")}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm resize-none"
              />
              {errors.content && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{errors.content.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || saving}
              className={`w-full py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-premium cursor-pointer mt-1 ${isSubmitting || saving
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/95 text-white border border-primary shadow-md shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.01]"
                }`}
            >
              {isSubmitting || saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Testimonial"
              )}
            </button>

          </form>
        </div>

        {/* History Log Column (col-span-7) */}
        <div className="md:col-span-7 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-secondary tracking-tight font-heading pl-2 mb-1">
            Feedback History Log
          </h3>

          {testimonials.length === 0 ? (
            <div className="bg-white border border-slate-200/70 rounded-[28px] p-8 text-center shadow-sm">
              <span className="text-3xl block mb-2">📝</span>
              <p className="text-xs text-text-muted font-body leading-relaxed">
                You haven't submitted any clinical testimonials yet. Submit the form on the left to write one.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {testimonials.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-slate-200/70 rounded-2.5xl py-5 ps-4 pe-3 shadow-sm hover:border-primary/15 transition-premium"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {item.user?.image ? (
                        <img
                          src={item.user.image}
                          alt="Avatar"
                          className="w-10 h-10 rounded-xl object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-secondary border border-slate-200 flex items-center justify-center font-bold text-sm">
                          {item.patientName ? item.patientName.charAt(0).toUpperCase() : "P"}
                        </div>
                      )}

                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-secondary font-heading">
                          {item.treatment}
                        </span>
                        <span className="text-[10px] text-slate-400 font-body">
                          Submitted on {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-1.5">
                      {/* Star Count */}
                      <div className="flex items-center gap-0.5 text-xs text-amber-500">
                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>

                      {/* Approval Status */}
                      <span className={`min-w-[75px] text-center inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${item.approved
                          ? "bg-emerald-50 border border-emerald-200/60 text-emerald-600"
                          : "bg-amber-50 border border-amber-200/60 text-amber-600"
                        }`}>
                        {item.approved ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs lg:text-[14px] text-text-muted font-body leading-relaxed italic bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    "{item.content}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardTestimonials;