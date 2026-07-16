import "./ResourceForm.css";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resourceSchema } from "../../validations/resourceSchema";
import CustomSelect from "../CustomSelect/CustomSelect";

const ResourceForm = ({
  onSubmit,
  defaultValues = {
    title: "",
    description: "",
    category: "General",
    published: true,
  },
  loading = false,
  submitText = "Save Resource",
  isEdit = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resourceSchema),
    defaultValues,
  });

  const categoryOptions = [
    { value: "General", label: "General" },
    { value: "Exercise", label: "Exercise" },
    { value: "Posture", label: "Posture" },
    { value: "Stretching", label: "Stretching" },
    { value: "Rehabilitation", label: "Rehabilitation" },
    { value: "Nutrition", label: "Nutrition" },
  ];

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Title Input */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
            Resource Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Lower Back Stretching Routine Guide"
            {...register("title")}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
          />
          {errors.title && (
            <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Category Custom Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
            Category
          </label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <CustomSelect
                value={field.value}
                onChange={field.onChange}
                options={categoryOptions}
                placeholder="Select Category"
              />
            )}
          />
          {errors.category && (
            <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      {/* Description Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
          Resource Description
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Briefly describe what exercises or clinical notes this document contains..."
          {...register("description")}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm resize-none"
        />
        {errors.description && (
          <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* File Upload Input */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
            Upload Document (PDF, DOC, DOCX, TXT)
          </label>
          <input
            id="file"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            {...register("file")}
            className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-wider file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer border border-slate-200/80 rounded-2xl p-2 bg-white/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary shadow-sm"
          />
          {isEdit && defaultValues.fileName && (
            <p className="text-[10px] text-slate-500 mt-1.5">
              Current file: <strong className="text-secondary">{defaultValues.fileName}</strong>
            </p>
          )}
          {errors.file && (
            <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
              {errors.file.message}
            </p>
          )}
        </div>

        {/* Publish Checkbox */}
        <div className="flex items-center mt-5 sm:justify-center">
          <label className="inline-flex items-center gap-3 cursor-pointer group select-none">
            <input
              type="checkbox"
              {...register("published")}
              className="w-5 h-5 rounded-md border-slate-200 text-primary focus:ring-primary/20 cursor-pointer accent-primary"
            />
            <span className="text-xs font-bold text-secondary uppercase tracking-wider font-heading group-hover:text-primary transition-colors">
              Make Visible
            </span>
          </label>
        </div>
      </div>

      {/* Action Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          style={{ cursor: loading ? "wait" : "pointer" }}
          className={`px-6 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-premium cursor-pointer ${
            loading
              ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
              : "bg-primary hover:bg-primary/95 text-white border-primary shadow hover:shadow-md hover:scale-[1.01]"
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

export default ResourceForm;
