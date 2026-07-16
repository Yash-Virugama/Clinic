import "./TestimonialForm.css";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const COMMON_TREATMENTS = [
  "Spinal Rehabilitation",
  "Sports Physiotherapy",
  "Post-Surgical Rehab",
  "Orthopedic Physiotherapy",
  "Pediatric Physiotherapy",
  "Geriatric Care",
  "Neurological Rehabilitation"
];

const formSchema = z.object({
  patientName: z
    .string()
    .min(3, "Patient name must be at least 3 characters"),

  content: z
    .string()
    .min(10, "Testimonial must be at least 10 characters"),

  rating: z.coerce
    .number()
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating cannot exceed 5.")
    .default(5),

  approved: z.boolean(),
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

const TestimonialForm = ({
  onSubmit,
  defaultValues = {
    patientName: "",
    content: "",
    approved: false,
    rating: 5,
    treatment: "",
  },
  loading = false,
  submitText = "Save Testimonial",
}) => {
  const initialTreatment = defaultValues.treatment || "";
  const isOther = initialTreatment && !COMMON_TREATMENTS.includes(initialTreatment);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: defaultValues.patientName || "",
      content: defaultValues.content || "",
      approved: defaultValues.approved || false,
      rating: defaultValues.rating || 5,
      treatmentType: isOther ? "Other" : (initialTreatment || "Spinal Rehabilitation"),
      customTreatment: isOther ? initialTreatment : "",
    },
  });

  useEffect(() => {
    const freshTreatment = defaultValues.treatment || "";
    const freshIsOther = freshTreatment && !COMMON_TREATMENTS.includes(freshTreatment);

    reset({
      patientName: defaultValues.patientName || "",
      content: defaultValues.content || "",
      approved: defaultValues.approved || false,
      rating: defaultValues.rating || 5,
      treatmentType: freshIsOther ? "Other" : (freshTreatment || "Spinal Rehabilitation"),
      customTreatment: freshIsOther ? freshTreatment : "",
    });
  }, [defaultValues, reset]);

  const selectedTreatmentType = watch("treatmentType");

  const onSubmitHandler = (data) => {
    const treatment = data.treatmentType === "Other" ? data.customTreatment : data.treatmentType;
    onSubmit({
      patientName: data.patientName,
      content: data.content,
      approved: data.approved,
      rating: data.rating,
      treatment,
    });
  };

  return (
    <form
      className="testimonial-form bg-white p-6 rounded-2.5xl border border-slate-200 shadow-sm max-w-xl mx-auto flex flex-col gap-5 mb-8"
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      <div className="form-group flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-secondary">Patient Name</label>
        <input
          type="text"
          {...register("patientName")}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-primary focus:outline-none"
        />
        {errors.patientName && <p className="text-red-500 text-xs">{errors.patientName.message}</p>}
      </div>

      <div className="form-group flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-secondary">Star Rating</label>
        <select
          {...register("rating")}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-primary focus:outline-none bg-white"
        >
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
        {errors.rating && <p className="text-red-500 text-xs">{errors.rating.message}</p>}
      </div>

      <div className="form-group flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-secondary">Treatment Received</label>
        <select
          {...register("treatmentType")}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-primary focus:outline-none bg-white"
        >
          {COMMON_TREATMENTS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
          <option value="Other">Other (please specify below)</option>
        </select>
        {errors.treatmentType && <p className="text-red-500 text-xs">{errors.treatmentType.message}</p>}
      </div>

      {selectedTreatmentType === "Other" && (
        <div className="form-group flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-secondary">Specify Treatment</label>
          <input
            type="text"
            placeholder="Specify treatment name..."
            {...register("customTreatment")}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-primary focus:outline-none"
          />
          {errors.customTreatment && <p className="text-red-500 text-xs">{errors.customTreatment.message}</p>}
        </div>
      )}

      <div className="form-group flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-secondary">Testimonial Content</label>
        <textarea
          rows={4}
          {...register("content")}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-primary focus:outline-none"
        />
        {errors.content && <p className="text-red-500 text-xs">{errors.content.message}</p>}
      </div>

      <div className="form-group flex items-center gap-2">
        <input
          type="checkbox"
          id="approved"
          {...register("approved")}
          className="w-4 h-4 rounded text-primary focus:ring-primary"
        />
        <label htmlFor="approved" className="text-sm font-medium text-secondary cursor-pointer select-none">
          Approved / Visible on Site
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-md transition-premium cursor-pointer disabled:opacity-50"
      >
        {loading ? "Saving..." : submitText}
      </button>
    </form>
  );
};

export default TestimonialForm;