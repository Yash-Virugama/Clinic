import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export const clinicVisitCreateSchema = z.object({
  clinicCase: z
    .string({ required_error: "Clinic Case ID is required" })
    .regex(objectIdRegex, "Invalid Clinic Case ID format"),
  
  visitDate: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) return new Date(val);
    return val;
  }, z.date({ required_error: "Visit date is required" })),
  
  visitTime: z
    .string()
    .regex(timeRegex, "Invalid time format. Use 24-hour format (HH:MM)")
    .optional()
    .or(z.literal("").optional()), // allow empty string to clear time
    
  therapist: z
    .string()
    .regex(objectIdRegex, "Invalid Therapist ID format")
    .optional(),
    
  location: z.enum(["clinic", "home", "online"], {
    errorMap: () => ({ message: "Location must be clinic, home, or online" }),
  }),
  
  duration: z
    .number()
    .int()
    .positive("Duration must be a positive number of minutes")
    .optional(),
    
  paymentAmount: z
    .number({ required_error: "Payment amount is required" })
    .nonnegative("Payment amount cannot be negative"),
    
  paymentStatus: z.enum(["Paid", "Unpaid"], {
    errorMap: () => ({ message: "Payment status must be Paid or Unpaid" }),
  }),
});

export const clinicVisitUpdateSchema = z.object({
  clinicCase: z
    .string()
    .regex(objectIdRegex, "Invalid Clinic Case ID format")
    .optional(),
  
  visitDate: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) return new Date(val);
    return val;
  }, z.date()).optional(),
  
  visitTime: z
    .string()
    .regex(timeRegex, "Invalid time format. Use 24-hour format (HH:MM)")
    .optional()
    .or(z.literal("").optional()),
    
  therapist: z
    .string()
    .regex(objectIdRegex, "Invalid Therapist ID format")
    .optional(),
    
  location: z.enum(["clinic", "home", "online"]).optional(),
  
  duration: z
    .number()
    .int()
    .positive("Duration must be a positive number of minutes")
    .optional(),
    
  paymentAmount: z
    .number()
    .nonnegative("Payment amount cannot be negative")
    .optional(),
    
  paymentStatus: z.enum(["Paid", "Unpaid"]).optional(),
  
  status: z.enum(["Scheduled", "Completed", "Cancelled"], {
    errorMap: () => ({ message: "Visit status must be Scheduled, Completed, or Cancelled" }),
  }).optional(),
});
