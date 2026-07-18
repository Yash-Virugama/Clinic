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

  phone: z.string().min(1, "Phone number is required."),

  age: z.coerce
    .number({ invalid_type_error: "Age is required." })
    .min(1, "Age must be greater than 0."),

  gender: z.string().min(1, "Gender is required."),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters."),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required."),

    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters."),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password."),
  })
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match.",
    }
  );

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters.")
    .max(50, "Name cannot exceed 50 characters."),

  email: z
    .string()
    .email("Invalid email address.")
    .optional(),

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
  removeImage: z.string().optional().or(z.boolean().optional()),
});
