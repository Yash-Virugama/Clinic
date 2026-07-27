import React, { useEffect, useState } from "react";
import ModalShell from "./ModalShell";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";

const CaseFormModal = ({ isOpen, onClose, onSubmit, isEdit = false, caseData = null, doctors = [], submitting }) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Active");
  const [consultingDoctor, setConsultingDoctor] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && caseData) {
      setTitle(caseData.title || "");
      setStatus(caseData.status || "Active");
      setConsultingDoctor(caseData.consultingDoctor?._id || caseData.consultingDoctor || "");
    } else {
      setTitle("");
      setStatus("Active");
      setConsultingDoctor(doctors[0]?._id || "");
    }
    setError("");
  }, [isOpen, isEdit, caseData, doctors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Case title is required.");
      return;
    }
    if (title.trim().length < 3) {
      setError("Case title must be at least 3 characters.");
      return;
    }
    if (!consultingDoctor) {
      setError("Please select a consulting doctor.");
      return;
    }

    setError("");
    onSubmit({
      title: title.trim(),
      status,
      consultingDoctor,
    });
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Case File" : "Open New Case File"}>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Case Title Input */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1.5">
            Case Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            placeholder="e.g. Bell's Palsy Left Side, LBP Therapy..."
            className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-xs text-secondary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium transition-all shadow-sm ${
              error && !title.trim() ? "border-rose-400 focus:border-rose-400" : "border-slate-200/70"
            }`}
          />
        </div>

        {/* Consulting Doctor Dropdown */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1.5">
            Consulting Doctor
          </label>
          <CustomSelect
            value={consultingDoctor}
            onChange={(val) => {
              setConsultingDoctor(val);
              if (error) setError("");
            }}
            options={doctors.map((doc) => ({
              value: doc._id,
              label: `${doc.name}`,
            }))}
            placeholder="Select Doctor"
          />
        </div>

        {/* Case Status Dropdown */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1.5">
            Case Status
          </label>
          <CustomSelect
            value={status}
            onChange={setStatus}
            options={[
              { value: "Active", label: "Active" },
              { value: "Resolved", label: "Resolved" },
              { value: "Closed", label: "Closed" },
              { value: "Cancelled", label: "Cancelled" },
            ]}
          />
        </div>

        {error && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider font-accent">{error}</p>}

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-secondary text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm disabled:opacity-50 transition-all cursor-pointer"
          >
            {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Case"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default CaseFormModal;
