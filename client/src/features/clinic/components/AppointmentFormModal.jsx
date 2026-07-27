import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import ModalShell from "./ModalShell";

const AppointmentFormModal = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  isEdit = false,
  selectedAppointment,
  patients,
  therapists,
  patientCases,
  form,
  errors,
  submitting,
  clearError,
  onQuickPatient,
}) => {
  const fieldClass = (field) =>
    `w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-secondary focus:outline-none focus:bg-white transition-all font-medium ${
      errors[field] ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-primary"
    }`;

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title={title} panelClassName="max-h-[90vh] overflow-y-auto">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {isEdit ? (
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-accent">Target Patient</label>
            <div className="px-4 py-3 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold">
              {selectedAppointment?.patient?.name}
            </div>
          </div>
        ) : (
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-accent">Select Patient</label>
            <CustomSelect
              value={form.patientId}
              onChange={(value) => {
                form.setPatientId(value);
                clearError("patient");
              }}
              options={(patients || []).map((patient) => ({ value: patient._id, label: `${patient.name} (${patient.phone})` }))}
              placeholder="Choose Patient"
              searchable={true}
            />
            <div className="flex justify-between items-center mt-1.5">
              <span className="text-[10px] text-slate-400">or</span>
              <button
                type="button"
                onClick={onQuickPatient}
                className="text-[10px] text-primary hover:text-primary-hover font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
              >
                Register New Patient
              </button>
            </div>
            {errors.patient && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{errors.patient}</p>}
          </div>
        )}

        {(form.patientId || isEdit) && (
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-accent">Link to Active Case File</label>
            <CustomSelect
              value={form.caseId}
              onChange={(value) => {
                form.setCaseId(value);
                clearError("clinicCase");
              }}
              options={[
                { value: "", label: "No Case / Independent visit" },
                ...(patientCases || []).map((clinicCase) => ({ value: clinicCase._id, label: clinicCase.title })),
              ]}
              placeholder="Choose Case File"
            />
            {errors.clinicCase && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{errors.clinicCase}</p>}
          </div>
        )}

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-accent">Consulting Therapist (Admin only)</label>
          <CustomSelect
            value={form.therapistId}
            onChange={(value) => {
              form.setTherapistId(value);
              clearError("therapist");
            }}
            options={(therapists || []).map((therapist) => ({ value: therapist._id, label: `Dr. ${therapist.name}` }))}
            placeholder="Choose Therapist"
          />
          {errors.therapist && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{errors.therapist}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-accent">Date</label>
            <input
              type="date"
              value={form.apptDate}
              onChange={(event) => {
                form.setApptDate(event.target.value);
                clearError("date");
              }}
              className={fieldClass("date")}
            />
            {errors.date && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-accent">Time (HH:MM)</label>
            <input
              type="time"
              value={form.apptTime}
              onChange={(event) => {
                form.setApptTime(event.target.value);
                clearError("time");
              }}
              className={fieldClass("time")}
            />
            {errors.time && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{errors.time}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-accent">Duration (mins)</label>
            <input
              type="number"
              value={form.apptDuration}
              onChange={(event) => {
                form.setApptDuration(Number(event.target.value));
                clearError("duration");
              }}
              placeholder="e.g. 30"
              className={fieldClass("duration")}
            />
            {errors.duration && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{errors.duration}</p>}
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-accent">Session Location</label>
            <CustomSelect
              value={form.apptLocation}
              onChange={(value) => {
                form.setApptLocation(value);
                clearError("location");
              }}
              options={[
                { value: "clinic", label: "Clinic" },
                { value: "home", label: "Home" },
                { value: "online", label: "Online" },
              ]}
            />
            {errors.location && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{errors.location}</p>}
          </div>
        </div>

        {isEdit && (
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-accent">Appointment Status</label>
            <CustomSelect
              value={form.apptStatus}
              onChange={(value) => {
                form.setApptStatus(value);
                clearError("status");
              }}
              options={[
                { value: "scheduled", label: "Scheduled" },
                { value: "complete", label: "Complete" },
                { value: "missed", label: "Missed" },
                { value: "cancel", label: "Cancelled" },
              ]}
            />
            {errors.status && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{errors.status}</p>}
          </div>
        )}

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-accent">Session Notes (Optional)</label>
          <textarea
            value={form.apptNotes}
            onChange={(event) => {
              form.setApptNotes(event.target.value);
              clearError("notes");
            }}
            placeholder="Record symptoms, objectives..."
            rows="3"
            className={`w-full bg-slate-50 border rounded-xl px-3.5 py-3 text-xs text-secondary placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all resize-none ${
              errors.notes ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-primary"
            }`}
          />
          {errors.notes && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{errors.notes}</p>}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-primary-hover shadow-sm disabled:opacity-50 transition-premium cursor-pointer"
          >
            {submitting ? (isEdit ? "Saving..." : "Scheduling...") : (isEdit ? "Save Modifications" : "Schedule Appointment")}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default AppointmentFormModal;
