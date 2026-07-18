import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters.")
    .max(50, "Name cannot exceed 50 characters."),

  email: z
    .string()
    .email("Invalid email address."),

  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits."),

  age: z.coerce
    .number()
    .min(1, "Age must be at least 1.")
    .max(120, "Age cannot exceed 120."),

  gender: z.enum(
    ["Male", "Female", "Other", "Prefer not to say"],
    {
      errorMap: () => ({
        message: "Please select a valid gender.",
      }),
    }
  ),

  image: z
    .any()
    .refine(
      (files) => !files || files.length === 0 || files[0]?.size <= MAX_FILE_SIZE,
      "Max image size is 5MB."
    )
    .optional(),
  removeImage: z.boolean().optional(),
});