import { z } from "zod";

export const subscriptionSchema = z.object({
  endpoint: z.string().url("Endpoint must be a valid URL"),
  keys: z.object({
    p256dh: z.string().min(1, "p256dh key is required"),
    auth: z.string().min(1, "auth key is required"),
  }),
  userAgent: z.string().optional(),
});

export const sendNotificationSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(500, "Message cannot exceed 500 characters"),
  targetUrl: z
    .string()
    .startsWith("/", "Target URL must be a relative internal path starting with '/'")
    .max(200, "Target URL cannot exceed 200 characters")
    .optional(),
  recipientType: z.enum(["all", "admin", "specific"]),
  userId: z.string().optional(),
});
