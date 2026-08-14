import React, { useState } from "react";
import { formatDateDDMMYYYY, formatTimeRange } from "../utils/clinicFormatters";
import WhatsAppReminderButton from "./WhatsAppReminderButton";
import ModalShell from "../../../components/ui/ModalShell";

const statusClassName = (status) => {
  if (status === "complete") return "bg-emerald-50 text-emerald-600 border-emerald-200";
  if (status === "missed") return "bg-rose-50 text-rose-600 border-rose-200";
  if (status === "cancel") return "bg-amber-50 text-amber-600 border-amber-200";
  return "bg-blue-50 text-blue-600 border-blue-200";
};

const AppointmentCard = ({
  appointment,
  patientCode,
  activeMenuId,
  setActiveMenuId,
  onEdit,
  onOpenPatient,
  onUpdateStatus,
  onDelete,
  isTomorrowPage = false,
}) => {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const isMenuOpen = activeMenuId === appointment._id;
  const statusLabel = appointment.status
    ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)
    : "Scheduled";

  return (
    <>
      <div
      onClick={() => onOpenPatient(appointment.patient?._id)}
      className="bg-white border border-slate-200/50 hover:-translate-y-1 rounded-2xl p-5 shadow-sm hover:shadow-md transition-premium flex flex-col justify-between cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenPatient(appointment.patient?._id);
        }
      }}
    >
      <div className="space-y-3.5">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-base font-heading font-bold text-semidarkblue tracking-tight leading-snug">
              {appointment.patient?.name}
            </h3>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold tracking-wider block mt-0.5">
              {patientCode}
            </span>
          </div>

          <div className="flex items-center gap-2 relative">
            <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${statusClassName(appointment.status)}`}>
              {statusLabel}
            </span>

            <div className="relative">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveMenuId(isMenuOpen ? null : appointment._id);
                }}
                className="w-4 h-4 text-slate-400 hover:text-primary flex items-center justify-center shrink-0 transition-all cursor-pointer"
                title="Change Status"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveMenuId(null);
                    }}
                  />

                  <div
                    onClick={(event) => event.stopPropagation()}
                    className="absolute right-6 -top-12 sm:-top-5 sm:right-5 mt-1.5 w-36 bg-white border border-slate-200/80 backdrop-blur-md rounded-2xl shadow-xl z-50 py-1.5 animate-page-entrance slide-in-from-top-1 duration-200"
                  >
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setIsViewOpen(true);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-4 py-2 text-xs font-extrabold font-accent text-blue-600 hover:bg-blue-50/40 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      View Details
                    </button>

                    <button
                      type="button"
                      onClick={async (event) => {
                        event.stopPropagation();
                        setActiveMenuId(null);
                        await onUpdateStatus(appointment._id, "complete");
                      }}
                      className="w-full px-4 py-2 text-xs font-extrabold font-accent text-emerald-600 hover:bg-emerald-50/40 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                    >
                      Complete
                    </button>
                    
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit(appointment);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-4 py-2 text-xs font-extrabold font-accent text-indigo-600 hover:bg-indigo-50/40 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                    >
                      Reschedule
                    </button>

                    <button
                      type="button"
                      onClick={async (event) => {
                        event.stopPropagation();
                        setActiveMenuId(null);
                        await onUpdateStatus(appointment._id, "cancel");
                      }}
                      className="w-full px-4 py-2 text-xs font-extrabold font-accent text-amber-600 hover:bg-amber-50/40 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                    >
                      Cancel Appt
                    </button>

                    <button
                      type="button"
                      onClick={async (event) => {
                        event.stopPropagation();
                        setActiveMenuId(null);
                        await onUpdateStatus(appointment._id, "missed");
                      }}
                      className="w-full px-4 py-2 text-xs font-extrabold font-accent text-rose-600 hover:bg-rose-50/40 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                    >
                      Missed
                    </button>
                    {isTomorrowPage && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onEdit(appointment);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-4 py-2 text-xs font-extrabold font-accent text-blue-600 hover:bg-blue-50/40 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                      >
                        Edit
                      </button>
                    )}

                    {/* Divider */}
                    <div className="border-t border-slate-200 my-0.5"></div>

                    {onDelete && (
                      
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setActiveMenuId(null);
                          onDelete(appointment._id);
                        }}
                        className="w-full px-4 py-2 text-xs font-extrabold font-accent text-amber-600 hover:bg-amber-50/40 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                      >
                        <svg className="w-3.5 h-3.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span>{appointment.date ? formatDateDDMMYYYY(appointment.date) : ""}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <span>{appointment.time ? formatTimeRange(appointment.time, appointment.duration) : ""}</span>
            <span className="text-[11px] text-slate-400 font-medium bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg">
              {appointment.duration}min {appointment.location === "home" ? "at home" : appointment.location === "clinic" ? "at clinic" : "online"}
            </span>

          </div>
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-200/80 flex justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-650 font-semibold">
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <span>{appointment.therapist?.name}</span>
        </div>

        <div className="flex items-center gap-2">
          {isTomorrowPage && appointment.status === "scheduled" && (
            <WhatsAppReminderButton appointment={appointment} />
          )}

          {!isTomorrowPage && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(appointment);
              }}
              className="flex gap-1 border border-primary/80 text-primary hover:bg-primary/5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit
            </button>
          )}
        </div>
      </div>
      </div>

      <ModalShell
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Appointment Details"
      >
        <div className="space-y-4.5 text-left text-xs font-bold text-slate-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Patient Name</span>
              <span className="text-secondary text-sm font-extrabold">{appointment.patient?.name || "—"}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Patient Ref Code</span>
              <span className="text-secondary font-mono font-extrabold uppercase">{patientCode || "—"}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Phone Number</span>
              <span className="text-secondary font-extrabold">{appointment.patient?.phone || "—"}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Therapist</span>
              <span className="text-secondary font-extrabold">{appointment.therapist?.name || "Unassigned"}</span>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 my-2"></div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Date & Time</span>
              <span className="text-secondary font-extrabold">
                {appointment.date ? formatDateDDMMYYYY(appointment.date) : "—"} @ {appointment.time || "—"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Duration & Location</span>
              <span className="text-secondary font-extrabold uppercase">
                {appointment.duration || 30} Mins / {appointment.location || "clinic"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Case Folder</span>
              <span className="text-secondary font-extrabold">{appointment.clinicCase?.title || "None (General)"}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Status</span>
              <span className={`inline-block px-2 py-0.5 font-black uppercase text-[9px] tracking-wider rounded border mt-0.5 ${statusClassName(appointment.status)}`}>
                {statusLabel}
              </span>
            </div>
          </div>

          {appointment.notes && (
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Session Notes</span>
              <p className="bg-slate-50 border border-slate-200/60 rounded-lg p-3.5 text-xs text-slate-650 font-medium leading-relaxed max-h-24 overflow-y-auto whitespace-pre-wrap">
                {appointment.notes}
              </p>
            </div>
          )}

          <div className="flex pt-4">
            <button
              type="button"
              onClick={() => setIsViewOpen(false)}
              className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer text-center"
            >
              Close Details
            </button>
          </div>
        </div>
      </ModalShell>
    </>
  );
};

export default AppointmentCard;
