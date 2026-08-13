import { z } from "zod";

export const clinicPatientCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Gender must be Male, Female, or Other" }),
  }),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  age: z.coerce
    .number({ invalid_type_error: "Age must be a valid number" })
    .int("Age must be a whole number")
    .min(0, "Age must be at least 0")
    .max(120, "Age cannot exceed 120"),
});

export const clinicPatientUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .optional(),
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Gender must be Male, Female, or Other" }),
  }).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .optional(),
  age: z.coerce
    .number()
    .int("Age must be a whole number")
    .min(0, "Age must be at least 0")
    .max(120, "Age cannot exceed 120")
    .optional(),
});

export const patientNoteCreateSchema = z.object({
  noteType: z.enum(["general", "alert"], {
    errorMap: () => ({ message: "Note type must be general or alert" }),
  }),
  note: z
    .string({ required_error: "Note text is required" })
    .trim()
    .min(1, "Note cannot be empty")
    .max(1000, "Note cannot exceed 1000 characters"),
});
