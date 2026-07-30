import React, { useEffect, useState } from "react";
import ModalShell from "../../../components/ui/ModalShell";
import CustomSelect from "../../../components/ui/CustomSelect";

const ClinicalRecordFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  isEdit = false,
  recordData = null,
  cases = [],
  selectedCaseId = "",
  submitting,
}) => {
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [alertsAndPrecautions, setAlertsAndPrecautions] = useState("");
  const [clinicCase, setClinicCase] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && recordData) {
      setChiefComplaint(recordData.chiefComplaint || "");
      setDiagnosis(recordData.diagnosis || "");
      setTreatmentPlan(recordData.treatmentPlan || "");
      setAlertsAndPrecautions(recordData.alertsAndPrecautions || "");
      setClinicCase(recordData.clinicCase?._id || recordData.clinicCase || "all");
    } else {
      setChiefComplaint("");
      setDiagnosis("");
      setTreatmentPlan("");
      setAlertsAndPrecautions("");
      
      const defaultCase = selectedCaseId === "all"
        ? "all"
        : (selectedCaseId || (cases.find((c) => c.status === "Active")?._id || cases[0]?._id || ""));
      setClinicCase(defaultCase);
    }
    setError("");
  }, [isOpen, isEdit, recordData, cases, selectedCaseId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chiefComplaint.trim()) {
      setError("Chief complaint is required.");
      return;
    }
    if (chiefComplaint.trim().length < 3) {
      setError("Chief complaint must be at least 3 characters.");
      return;
    }
    if (!clinicCase) {
      setError("Please select a case file to associate with this record.");
      return;
    }

    setError("");
    onSubmit({
      chiefComplaint: chiefComplaint.trim(),
      diagnosis: diagnosis.trim(),
      treatmentPlan: treatmentPlan.trim(),
      alertsAndPrecautions: alertsAndPrecautions.trim(),
      clinicCase,
    });
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Clinical Record" : "Add Clinical Record"}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Case Association */}
        {(selectedCaseId === "all" || isEdit) && (
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
              options={[
                { value: "all", label: "General" },
                ...cases.map((c, index) => ({
                  value: c._id,
                  label: `Case ${index + 1} - ${c.title}`,
                }))
              ]}
              placeholder="Select Case File"
            />
          </div>
        )}

        {/* Chief Complaint */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1">
            Chief Complaint <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            value={chiefComplaint}
            onChange={(e) => {
              setChiefComplaint(e.target.value);
              if (error) setError("");
            }}
            placeholder="Describe the main complaint or symptoms..."
            className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs text-secondary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium transition-all shadow-sm resize-none ${
              error && !chiefComplaint.trim() ? "border-rose-400 focus:border-rose-400" : "border-slate-200/70"
            }`}
          />
        </div>

        {/* Diagnosis */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1">
            Diagnosis
          </label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Clinical diagnosis..."
            className="w-full bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-2.5 text-xs text-secondary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium transition-all shadow-sm"
          />
        </div>

        {/* Treatment Plan */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1">
            Treatment Plan
          </label>
          <textarea
            rows={3}
            value={treatmentPlan}
            onChange={(e) => setTreatmentPlan(e.target.value)}
            placeholder="Outline exercises, physical therapy interventions, sessions plan..."
            className="w-full bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-2.5 text-xs text-secondary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium transition-all shadow-sm resize-none"
          />
        </div>

        {/* Alerts & Precautions */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1">
            Alerts & Precautions
          </label>
          <input
            type="text"
            value={alertsAndPrecautions}
            onChange={(e) => setAlertsAndPrecautions(e.target.value)}
            placeholder="Contraindications, red flags, warning parameters..."
            className="w-full bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-2.5 text-xs text-secondary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium transition-all shadow-sm"
          />
        </div>

        {error && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider font-accent">{error}</p>}

        {/* Footer Actions */}
        <div className="flex justify-end items-center gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4.5 py-2 bg-slate-100 hover:bg-slate-200/80 text-secondary text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4.5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm disabled:opacity-50 transition-all cursor-pointer"
          >
            {submitting ? "Saving..." : isEdit ? "Save Changes" : "Save Record"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default ClinicalRecordFormModal;
