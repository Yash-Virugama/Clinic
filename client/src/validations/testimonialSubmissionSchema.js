import { z } from "zod";

export const testimonialSubmissionSchema = z.object({
  content: z
    .string()
    .trim()
    .min(10, "Testimonial must be at least 10 characters.")
    .max(1000, "Testimonial cannot exceed 1000 characters."),

  rating: z.coerce
    .number()
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating cannot exceed 5.")
    .default(5),

  treatment: z
    .string()
    .trim()
    .min(3, "Treatment name must be at least 3 characters.")
    .max(100, "Treatment name cannot exceed 100 characters."),
});