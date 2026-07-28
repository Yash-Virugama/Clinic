import React, { useEffect, useState } from "react";
import ModalShell from "./ModalShell";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";

const locationOptions = [
  { value: "clinic", label: "Clinic" },
  { value: "home", label: "Home" },
  { value: "online", label: "Online" },
];

const paymentStatusOptions = [
  { value: "Unpaid", label: "Unpaid" },
  { value: "Paid", label: "Paid" },
];

const statusOptions = [
  { value: "Scheduled", label: "Scheduled" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

const VisitFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEdit = false,
  visitData = null,
  cases = [],
  selectedCaseId = "",
  doctors = [],
  submitting,
}) => {
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [therapist, setTherapist] = useState("");
  const [location, setLocation] = useState("clinic");
  const [duration, setDuration] = useState(30);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [status, setStatus] = useState("Scheduled");
  const [clinicCase, setClinicCase] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (isEdit && visitData) {
        // Parse date to YYYY-MM-DD
        const dateVal = visitData.visitDate
          ? new Date(visitData.visitDate).toISOString().split("T")[0]
          : "";
        setVisitDate(dateVal);
        setVisitTime(visitData.visitTime || "");
        setTherapist(visitData.therapist?._id || visitData.therapist || "");
        setLocation(visitData.location || "clinic");
        setDuration(visitData.duration || 30);
        setPaymentAmount(visitData.paymentAmount || 0);
        setPaymentStatus(visitData.paymentStatus || "Unpaid");
        setStatus(visitData.status || "Scheduled");
        setClinicCase(visitData.clinicCase?._id || visitData.clinicCase || "");
      } else {
        const today = new Date().toISOString().split("T")[0];
        setVisitDate(today);
        setVisitTime("");
        setTherapist(doctors[0]?._id || "");
        setLocation("clinic");
        setDuration(30);
        setPaymentAmount(0);
        setPaymentStatus("Unpaid");
        setStatus("Scheduled");
        
        const defaultCase = selectedCaseId === "all"
          ? (cases[0]?._id || "")
          : (selectedCaseId || (cases.find((c) => c.status === "Active")?._id || cases[0]?._id || ""));
        setClinicCase(defaultCase);
      }
      setError("");
    }
  }, [isOpen, isEdit, visitData, cases, selectedCaseId, doctors]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!visitDate) {
      setError("Visit date is required.");
      return;
    }
    if (!clinicCase) {
      setError("Please select a case file to link this visit to.");
      return;
    }
    if (!therapist) {
      setError("Please select a therapist/doctor.");
      return;
    }

    setError("");
    onSubmit({
      visitDate,
      visitTime,
      therapist,
      location,
      duration: Number(duration),
      paymentAmount: Number(paymentAmount),
      paymentStatus,
      status,
      clinicCase,
    });
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Visit Logs" : "Log Patient Visit"}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Case File Selection */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1.5">
            Case File Link <span className="text-rose-500">*</span>
          </label>
          <CustomSelect
            value={clinicCase}
            onChange={(val) => {
              setClinicCase(val);
              if (error) setError("");
            }}
            options={cases.map((c, index) => ({
              value: c._id,
              label: `Case ${index + 1} - ${c.title}`,
            }))}
            placeholder="Select Case File"
          />
        </div>

        {/* Date & Time Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1.5">
              Visit Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full px-2 sm:px-4 py-2.5 bg-slate-50/50 border border-slate-200/80 focus:border-primary/50 focus:bg-white rounded-xl text-slate-700 text-sm font-medium transition-all outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1.5">
              Visit Time
            </label>
            <input
              type="time"
              value={visitTime}
              onChange={(e) => setVisitTime(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200/80 focus:border-primary/50 focus:bg-white rounded-xl text-slate-700 text-sm font-medium transition-all outline-none"
            />
          </div>
        </div>

        {/* Therapist Selection */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1.5">
            Therapist / Consultant <span className="text-rose-500">*</span>
          </label>
          <CustomSelect
            value={therapist}
            onChange={(val) => setTherapist(val)}
            options={doctors.map((doc) => ({
              value: doc._id,
              label: doc.name,
            }))}
            placeholder="Select Therapist"
          />
        </div>

        {/* Location & Duration Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1.5">
              Location <span className="text-rose-500">*</span>
            </label>
            <CustomSelect
              value={location}
              onChange={(val) => setLocation(val)}
              options={locationOptions}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1.5">
              Duration (mins)
            </label>
            <input
              type="number"
              min="5"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200/80 focus:border-primary/50 focus:bg-white rounded-xl text-slate-700 text-sm font-medium transition-all outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        {/* Amount & Payment Status Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1.5">
              Payment Amount (₹)
            </label>
            <input
              type="number"
              min="0"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200/80 focus:border-primary/50 focus:bg-white rounded-xl text-slate-700 text-sm font-medium transition-all outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1.5">
              Payment Status
            </label>
            <CustomSelect
              value={paymentStatus}
              onChange={(val) => setPaymentStatus(val)}
              options={paymentStatusOptions}
            />
          </div>
        </div>

        {/* Session Status */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1.5">
            Visit Status <span className="text-rose-500">*</span>
          </label>
          <CustomSelect
            value={status}
            onChange={(val) => setStatus(val)}
            options={statusOptions}
          />
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-4.5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            disabled={submitting}
          >
            {submitting ? "Saving..." : isEdit ? "Update Visit" : "Log Visit"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default VisitFormModal;
