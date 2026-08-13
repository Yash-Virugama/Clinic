import { formatDateDDMMYYYY } from "./clinicFormatters";

/**
 * Normalizes phone numbers to a clean format suitable for WhatsApp Click-to-Chat links.
 * Normalizes prepended country codes and strips invalid formatting symbols.
 * Example: "+91 98765 43210" -> "919876543210"
 */
export const normalizePhoneNumber = (phone) => {
  if (!phone) return "";
  // Strip all non-digit characters
  const digitsOnly = phone.replace(/\D/g, "");
  
  let cleaned = digitsOnly;
  // If it starts with '0', remove the leading '0'
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }
  
  // If it's a 10-digit number, prepend the Indian country code '91' by default
  if (cleaned.length === 10) {
    cleaned = "91" + cleaned;
  }
  
  return cleaned;
};

/**
 * Formats a personalized WhatsApp reminder message.
 */
export const generateReminderMessage = (appointment, settings) => {
  const patientName = appointment.patient?.name || "Patient";
  const clinicName = settings?.name || "PhysioCare";
  const appointmentDate = appointment.date ? formatDateDDMMYYYY(appointment.date) : "Tomorrow";
  const appointmentTime = appointment.time || "Scheduled Time";
  const serviceName = appointment.clinicCase?.title || "Physiotherapy Session";

  return `Hello ${patientName} \u{1F44B}

This is a reminder from ${clinicName}.

Your physiotherapy appointment is scheduled for tomorrow.

\u{1F4C5} Date: ${appointmentDate}
\u{1F559} Time: ${appointmentTime}
\u{1F3E5} ${clinicName}

Service: ${serviceName}

If you need to reschedule your appointment, please contact us.

Thank you!`;
};

/**
 * Generates a wa.me Click-to-Chat link.
 */
export const generateWhatsAppLink = (phone, message) => {
  const normalizedPhone = normalizePhoneNumber(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${normalizedPhone}&text=${encodedMessage}`;
};
