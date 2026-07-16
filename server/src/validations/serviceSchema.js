import { z } from "zod";

export const serviceSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  order: z.coerce
    .number()
    .min(1, "Order must be at least 1"),

  image: z.any().optional(),
});
