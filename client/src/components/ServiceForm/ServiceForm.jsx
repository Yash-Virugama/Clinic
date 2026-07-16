import "./ServiceForm.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema } from "../../validations/serviceSchema";

const ServiceForm = ({
  onSubmit,
  defaultValues = {
    title: "",
    description: "",
    order: "",
  },
  loading = false,
  submitText = "Save Service",
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues,
  });

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Title Input */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
            Service Title
          </label>
          <input
            type="text"
            placeholder="e.g. Spinal Decompression Therapy"
            {...register("title")}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
          />
          {errors.title && (
            <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Order Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
            Display Order
          </label>
          <input
            type="number"
            placeholder="e.g. 1"
            {...register("order")}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
          />
          {errors.order && (
            <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
              {errors.order.message}
            </p>
          )}
        </div>
      </div>

      {/* Description Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
          Service Description
        </label>
        <textarea
          rows={5}
          placeholder="Describe the service details, treatment methods, and benefits..."
          {...register("description")}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm resize-none"
        />
        {errors.description && (
          <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Image File Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
          Cover Image
        </label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-wider file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer border border-slate-200/80 rounded-2xl p-2 bg-white/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary shadow-sm"
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          style={{ cursor: loading ? "wait" : "pointer" }}
          className={`px-6 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-premium cursor-pointer ${
            loading
              ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
              : "bg-primary hover:bg-primary/95 text-white border border-primary shadow hover:shadow-md hover:scale-[1.01]"
          }`}
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;