import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

// Schema for creating a clinic appointment
export const appointmentCreateSchema = z.object({
  patient: z
    .string({ required_error: "Patient is required" })
    .regex(objectIdRegex, "Select a valid patient"),
    
  therapist: z
    .string({ required_error: "Therapist is required" })
    .regex(objectIdRegex, "Select a valid therapist"),
    
  date: z
    .string({ required_error: "Appointment date is required" })
    .min(1, "Appointment date is required"),
  
  time: z
    .string({ required_error: "Appointment time is required" })
    .regex(timeRegex, "Enter time in 24-hour format (HH:MM)"),
    
  duration: z
    .number({ required_error: "Duration is required" })
    .int("Duration must be a whole number")
    .positive("Duration must be a positive number of minutes"),
    
  location: z.enum(["clinic", "home", "online"], {
    errorMap: () => ({ message: "Select a location (clinic, home, or online)" }),
  }),
  
  clinicCase: z
    .string({ required_error: "Link to case is required" })
    .regex(objectIdRegex, "Select a valid case file")
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
