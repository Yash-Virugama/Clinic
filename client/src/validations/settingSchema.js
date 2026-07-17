import { z } from "zod";

export const settingSchema = z.object({
  name: z.string().trim().min(2, "Brand name must be at least 2 characters."),
  address: z.string().trim().min(5, "Address must be at least 5 characters."),
  phone: z.string().trim().min(8, "Phone number must be at least 8 characters."),
  emergencyPhone: z.string().trim().optional().or(z.literal("")),
  emailGeneral: z.string().trim().email("Please enter a valid general email address."),
  emailRehab: z.string().trim().optional().or(z.literal("")),
  workingHours: z.string().trim().min(3, "Working hours must be defined."),
  closedHours: z.string().trim().min(3, "Closed hours details must be defined."),
  mapLink: z.string().trim().url("Google Map link must be a valid URL."),
  facebook: z.string().trim().optional().or(z.literal("")),
  instagram: z.string().trim().optional().or(z.literal("")),
  youtube: z.string().trim().optional().or(z.literal("")),
  appName: z.string().trim().optional().or(z.literal("")),
  shortName: z.string().trim().optional().or(z.literal("")),
});
