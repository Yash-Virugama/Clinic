import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const clinicalRecordCreateSchema = z.object({
  chiefComplaint: z
    .string({ required_error: "Chief complaint is required" })
    .trim()
    .min(3, "Chief complaint must be at least 3 characters")
    .max(500, "Chief complaint cannot exceed 500 characters"),
    
  diagnosis: z
    .string()
    .trim()
    .max(500, "Diagnosis cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
    
  clinicCase: z
    .string({ required_error: "Link to case is required" })
    .regex(objectIdRegex, "Invalid Clinic Case ID format")
    .or(z.literal("no specific case"))
    .or(z.literal(""))
    .or(z.literal("null")),
    
  patient: z
    .string()
    .regex(objectIdRegex, "Invalid Patient ID format")
    .optional()
    .nullable()
    .or(z.literal("")),
    
  treatmentPlan: z
    .string()
    .trim()
    .max(1000, "Treatment plan cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
    
  alertsAndPrecautions: z
    .string()
    .trim()
    .max(500, "Alerts and precautions cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

export const clinicalRecordUpdateSchema = z.object({
  chiefComplaint: z
    .string()
    .trim()
    .min(3, "Chief complaint must be at least 3 characters")
    .max(500, "Chief complaint cannot exceed 500 characters")
    .optional(),
    
  diagnosis: z
    .string()
    .trim()
    .max(500, "Diagnosis cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
    
  clinicCase: z
    .string()
    .regex(objectIdRegex, "Invalid Clinic Case ID format")
    .or(z.literal("no specific case"))
    .or(z.literal(""))
    .or(z.literal("null"))
    .optional(),
    
  patient: z
    .string()
    .regex(objectIdRegex, "Invalid Patient ID format")
    .optional()
    .nullable()
    .or(z.literal("")),
    
  treatmentPlan: z
    .string()
    .trim()
    .max(1000, "Treatment plan cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
    
  alertsAndPrecautions: z
    .string()
    .trim()
    .max(500, "Alerts and precautions cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
});
