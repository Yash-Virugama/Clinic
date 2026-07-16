import "./BlogForm.css";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema } from "../../validations/blogSchema";

const BlogForm = ({
  onSubmit,
  defaultValues = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    published: false,
  },
  loading = false,
  submitText = "Save Blog",
}) => {
  const [slugEdited, setSlugEdited] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues,
  });

  const title = useWatch({
    control,
    name: "title",
  });

  useEffect(() => {
    if (!title || slugEdited) return;

    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    setValue("slug", generatedSlug);
  }, [title, slugEdited, setValue]);

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Row 1: Title and Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
            Article Title
          </label>
          <input
            type="text"
            placeholder="e.g. 5 Stretch Exercises for Back Pain Relief"
            {...register("title")}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
          />
          {errors.title && (
            <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
            URL Slug (auto-generated)
          </label>
          <input
            type="text"
            placeholder="e.g. 5-stretch-exercises-for-back-pain-relief"
            {...register("slug")}
            onChange={() => setSlugEdited(true)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
          />
          {errors.slug && (
            <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
              {errors.slug.message}
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Category and Tags */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
            Category
          </label>
          <input
            type="text"
            placeholder="e.g. Spine Health"
            {...register("category")}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
          />
          {errors.category && (
            <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
            Tags (comma separated)
          </label>
          <input
            type="text"
            placeholder="physiotherapy, back-pain, exercise"
            {...register("tags")}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
          />
          {errors.tags && (
            <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
              {errors.tags.message}
            </p>
          )}
        </div>
      </div>

      {/* Excerpt Textarea */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
          Short Excerpt
        </label>
        <textarea
          rows={3}
          placeholder="Write a brief overview summary or hook for this article (shows up on listing grids)..."
          {...register("excerpt")}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm resize-none"
        />
        {errors.excerpt && (
          <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
            {errors.excerpt.message}
          </p>
        )}
      </div>

      {/* Content Textarea */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
          Article Body Content
        </label>
        <textarea
          rows={8}
          placeholder="Write the full clinical column content using markdown or raw HTML paragraphs..."
          {...register("content")}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm resize-y"
        />
        {errors.content && (
          <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
            {errors.content.message}
          </p>
        )}
      </div>

      {/* Cover Image and Publish Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("coverImage")}
            className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-wider file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer border border-slate-200/80 rounded-2xl p-2 bg-white/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary shadow-sm"
          />
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
              Publish Live
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

export default BlogForm;