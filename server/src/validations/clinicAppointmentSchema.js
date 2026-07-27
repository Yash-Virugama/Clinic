import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export const clinicAppointmentCreateSchema = z.object({
  patient: z
    .string({ required_error: "Patient ID is required" })
    .regex(objectIdRegex, "Invalid Patient ID format"),
    
  therapist: z
    .string({ required_error: "Therapist ID is required" })
    .regex(objectIdRegex, "Invalid Therapist ID format"),
    
  date: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) return new Date(val);
    return val;
  }, z.date({ required_error: "Appointment date is required" })),
  
  time: z
    .string({ required_error: "Appointment time is required" })
    .regex(timeRegex, "Invalid time format. Use 24-hour format (HH:MM)"),
    
  duration: z
    .number({ required_error: "Duration is required" })
    .int()
    .positive("Duration must be a positive number of minutes"),
    
  location: z.enum(["clinic", "home", "online"], {
    errorMap: () => ({ message: "Location must be clinic, home, or online" }),
  }),
  
  clinicCase: z
    .string({ required_error: "Link to case is required" })
    .regex(objectIdRegex, "Invalid Clinic Case ID format")
    .or(z.literal("no case"))
    .or(z.literal(""))
    .or(z.literal("null")),
    
  status: z
    .enum(["scheduled", "complete", "missed", "cancel"])
    .optional(),
    
  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
});

export const clinicAppointmentUpdateSchema = z.object({
  patient: z
    .string()
    .regex(objectIdRegex, "Invalid Patient ID format")
    .optional(),
    
  therapist: z
    .string()
    .regex(objectIdRegex, "Invalid Therapist ID format")
    .optional(),
    
  date: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) return new Date(val);
    return val;
  }, z.date()).optional(),
  
  time: z
    .string()
    .regex(timeRegex, "Invalid time format. Use 24-hour format (HH:MM)")
    .optional(),
    
  duration: z
    .number()
    .int()
    .positive("Duration must be a positive number of minutes")
    .optional(),
    
  location: z.enum(["clinic", "home", "online"]).optional(),
  
  clinicCase: z
    .string()
    .regex(objectIdRegex, "Invalid Clinic Case ID format")
    .or(z.literal("no case"))
    .or(z.literal(""))
    .or(z.literal("null"))
    .optional(),
    
  status: z
    .enum(["scheduled", "complete", "missed", "cancel"])
    .optional(),
    
  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
});
