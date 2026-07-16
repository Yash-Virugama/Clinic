import { z } from "zod";

export const blogSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters"),

  slug: z
    .string()
    .min(3, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),

  excerpt: z
    .string()
    .min(10, "Excerpt must be at least 10 characters"),

  content: z
    .string()
    .min(20, "Content must be at least 20 characters"),

  category: z
    .string()
    .min(3, "Category is required"),

  tags: z.string().optional(),

  published: z.preprocess((val) => {
    if (typeof val === "string") {
      if (val.toLowerCase() === "true") return true;
      if (val.toLowerCase() === "false") return false;
    }
    if (typeof val === "boolean") return val;
    return val; // Fallback to let Zod handle validation error if any other type
  }, z.boolean()),
});
