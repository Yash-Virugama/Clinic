import { z } from "zod";

export const testimonialSchema = z.object({
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

  treatment: z
    .string()
    .trim()
    .min(3, "Treatment name must be at least 3 characters.")
    .max(100, "Treatment name cannot exceed 100 characters."),

  approved: z.boolean(),
});