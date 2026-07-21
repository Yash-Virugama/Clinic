import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters."),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters."),

  email: z.string().email("Please enter a valid email address."),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters."),

  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),

  age: z
    .number({ invalid_type_error: "Age is required." })
    .min(1, "Age must be greater than 0."),

  gender: z.string().min(1, "Gender is required."),
});