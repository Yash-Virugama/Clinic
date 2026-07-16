import { z } from "zod";

export const resourceSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  category: z.enum(
    ["Exercise", "Posture", "Stretching", "Rehabilitation", "Nutrition", "General"],
    { errorMap: () => ({ message: "Category is required" }) }
  ),

  published: z.preprocess((val) => {
    if (typeof val === "string") {
      if (val.toLowerCase() === "true") return true;
      if (val.toLowerCase() === "false") return false;
    }
    if (typeof val === "boolean") return val;
    return val;
  }, z.boolean()),

  file: z.any().optional(),
});
