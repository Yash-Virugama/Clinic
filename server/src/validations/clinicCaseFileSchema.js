import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const clinicCaseFileCreateSchema = z.object({
  fileName: z
    .string({ required_error: "File name is required" })
    .trim()
    .min(2, "File name must be at least 2 characters")
    .max(100, "File name cannot exceed 100 characters"),
    
  fileType: z
    .enum([
      "MRI report",
      "x-ray",
      "blood test",
      "referral letter",
      "prescription",
      "discharge summary",
      "other",
    ])
    .optional(),
    
  clinicCase: z
    .string()
    .regex(objectIdRegex, "Invalid Clinic Case ID format")
    .optional()
    .nullable()
    .or(z.literal(""))
    .or(z.literal("null")),
    
  patient: z
    .string()
    .regex(objectIdRegex, "Invalid Patient ID format")
    .optional()
    .nullable()
    .or(z.literal("")), // handle frontend sending literal 'null' string
    
  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
});

export const clinicCaseFileUpdateSchema = z.object({
  fileName: z
    .string()
    .trim()
    .min(2, "File name must be at least 2 characters")
    .max(100, "File name cannot exceed 100 characters")
    .optional(),
    
  fileType: z
    .enum([
      "MRI report",
      "x-ray",
      "blood test",
      "referral letter",
      "prescription",
      "discharge summary",
      "other",
    ])
    .optional(),
    
  clinicCase: z
    .string()
    .regex(objectIdRegex, "Invalid Clinic Case ID format")
    .optional()
    .nullable()
    .or(z.literal(""))
    .or(z.literal("null")),
    
  patient: z
    .string()
    .regex(objectIdRegex, "Invalid Patient ID format")
    .optional()
    .nullable()
    .or(z.literal("")),
    
  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
});
