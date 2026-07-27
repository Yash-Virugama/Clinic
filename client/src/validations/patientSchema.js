import { z } from "zod";

// Schema for creating/registering a patient
export const patientCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Patient full name is required"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  gender: z
    .enum(["Male", "Female", "Other"], {
      errorMap: () => ({ message: "Select a valid gender" }),
    }),
});

// Schema for creating a progress note
export const patientNoteCreateSchema = z.object({
  noteType: z
    .enum(["general", "alert"], {
      errorMap: () => ({ message: "Select a valid note category" }),
    }),
  note: z
    .string()
    .trim()
    .min(1, "Note details cannot be empty"),
});
