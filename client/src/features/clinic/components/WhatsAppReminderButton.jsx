import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { useBranding } from "../../../context/BrandingContext";
import {
  normalizePhoneNumber,
  generateReminderMessage,
  generateWhatsAppLink,
} from "../utils/whatsappUtils";

const WhatsAppReminderButton = ({ appointment }) => {
  const { settings } = useBranding();
  const [isSent, setIsSent] = useState(appointment.reminderSent);

  const handleSendReminder = async (event) => {
    event.stopPropagation(); // prevent parent element clicks

    const rawPhone = appointment.patient?.phone;
    if (!rawPhone) {
      toast.error("Patient does not have a phone number registered.");
      return;
    }

    const normalized = normalizePhoneNumber(rawPhone);
    if (normalized.length < 10) {
      toast.error("Patient phone number format is invalid.");
      return;
    }

    try {
      // Immediately transition the UI to sent state
      setIsSent(true);

      // Persist the state in the backend database
      await api.put(`/clinic/appointments/${appointment._id}/reminder`);

      // Generate the reminder message and open WhatsApp Click-to-Chat
      const message = generateReminderMessage(appointment, settings);
      const waUrl = generateWhatsAppLink(rawPhone, message);
      window.open(waUrl, "_blank");

      toast.success("Reminder status updated. Opening WhatsApp...");
    } catch (error) {
      console.error("Failed to update WhatsApp reminder status:", error);
      toast.error("Failed to persist reminder status.");
      // Rollback state if the database save failed
      setIsSent(appointment.reminderSent);
    }
  };

  if (isSent) {
    return (
      <button
        type="button"
        onClick={handleSendReminder}
        title="Send another reminder"
        className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-600 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all duration-200 hover:border-emerald-300 active:scale-95 cursor-pointer shadow-sm"
      >
        <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        <span>Reminder Sent</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSendReminder}
      className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer shadow-sm shrink-0"
    >
      {/* WhatsApp icon */}
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.835-2.277c1.662.986 3.29 1.48 4.908 1.48 5.61 0 10.174-4.567 10.177-10.177.002-2.72-1.055-5.277-2.978-7.202-1.92-1.923-4.474-2.98-7.193-2.98-5.617 0-10.183 4.568-10.187 10.18-.001 1.716.46 3.39 1.332 4.887L1.134 22.86l4.758-1.248c1.33.727 2.298 1.057 3.821.111zm11.758-7.795c-.29-.145-1.72-.848-1.986-.944-.266-.096-.46-.145-.653.145-.193.29-.747.944-.916 1.137-.168.193-.337.217-.627.072-2.31-1.036-3.873-2.247-5.068-4.298-.266-.458.266-.426.762-1.417.085-.17.042-.317-.02-.462-.064-.145-.653-1.572-.895-2.152-.236-.569-.475-.49-.653-.5-.17-.008-.363-.01-.556-.01-.193 0-.507.072-.772.36-.266.29-1.014.992-1.014 2.417s1.037 2.802 1.182 2.995c.145.193 2.036 3.11 4.931 4.36.688.297 1.226.475 1.643.607.69.219 1.32.188 1.817.114.553-.082 1.72-.703 1.961-1.383.24-.68.24-1.263.168-1.383-.072-.12-.265-.192-.555-.337z" />
      </svg>
      <span>Reminder</span>
    </button>
  );
};

export default WhatsAppReminderButton;
