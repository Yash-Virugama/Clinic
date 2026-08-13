import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const clinicCaseCreateSchema = z.object({
  patient: z
    .string({ required_error: "Patient ID is required" })
    .regex(objectIdRegex, "Invalid Patient ID format"),
  title: z
    .string({ required_error: "Case title is required" })
    .trim()
    .min(3, "Case title must be at least 3 characters")
    .max(100, "Case title cannot exceed 100 characters"),
  consultingDoctor: z
    .string({ required_error: "Consulting Doctor ID is required" })
    .regex(objectIdRegex, "Invalid Consulting Doctor ID format"),
  status: z
    .enum(["Active", "Resolved", "Closed", "Cancelled"])
    .optional(),
  treatment: z
    .string({ required_error: "Treatment is required" })
    .trim()
    .min(3, "Treatment must be at least 3 characters")
    .max(500, "Treatment details cannot exceed 500 characters"),
});

export const clinicCaseUpdateSchema = z.object({
  patient: z
    .string()
    .regex(objectIdRegex, "Invalid Patient ID format")
    .optional(),
  title: z
    .string()
    .trim()
    .min(3, "Case title must be at least 3 characters")
    .max(100, "Case title cannot exceed 100 characters")
    .optional(),
  consultingDoctor: z
    .string()
    .regex(objectIdRegex, "Invalid Consulting Doctor ID format")
    .optional(),
  status: z
    .enum(["Active", "Resolved", "Closed", "Cancelled"])
    .optional(),
  treatment: z
    .string()
    .trim()
    .min(3, "Treatment must be at least 3 characters")
    .max(500, "Treatment details cannot exceed 500 characters")
    .optional(),
});
