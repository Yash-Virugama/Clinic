import React, { useEffect, useRef, useState } from "react";
import ModalShell from "../../../components/ui/ModalShell";
import CustomSelect from "../../../components/ui/CustomSelect";

const docTypeOptions = [
  { value: "MRI report", label: "MRI Report" },
  { value: "x-ray", label: "X-Ray" },
  { value: "blood test", label: "Blood Test" },
  { value: "referral letter", label: "Referral Letter" },
  { value: "prescription", label: "Prescription" },
  { value: "discharge summary", label: "Discharge Summary" },
  { value: "other", label: "Other Document" },
];

const DocFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEdit = false,
  fileData = null,
  cases = [],
  selectedCaseId = "",
  submitting,
}) => {
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("other");
  const [clinicCase, setClinicCase] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEdit && fileData) {
      setFileName(fileData.fileName || "");
      setFileType(fileData.fileType || "other");
      setClinicCase(fileData.clinicCase?._id || fileData.clinicCase || "all");
      setNotes(fileData.notes || "");
      setSelectedFile(null);
    } else {
      setFileName("");
      setFileType("other");
      setSelectedFile(null);
      setNotes("");
      
      const defaultCase = selectedCaseId === "all"
        ? "all"
        : (selectedCaseId || (cases.find((c) => c.status === "Active")?._id || cases[0]?._id || ""));
      setClinicCase(defaultCase);
    }
    setError("");
  }, [isOpen, isEdit, fileData, cases, selectedCaseId]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-populate fileName with the actual file's name (without extension or clean name) if empty
      if (!fileName) {
        const cleanName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
        setFileName(cleanName);
      }
      if (error) setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fileName.trim()) {
      setError("Document name is required.");
      return;
    }
    if (!isEdit && !selectedFile) {
      setError("Please choose a file to upload.");
      return;
    }
    if (!clinicCase) {
      setError("Please select a case file to link this document to.");
      return;
    }

    setError("");
    onSubmit({
      fileName: fileName.trim(),
      fileType,
      clinicCase,
      notes: notes.trim(),
      file: selectedFile,
    });
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Document Metadata" : "Upload Document"}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        
        {/* File Picker (Available in both create and edit modes) */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1.5">
            {isEdit ? "Replace File (Optional)" : "Select File"} {!isEdit && <span className="text-rose-500">*</span>}
          </label>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4.5 text-center cursor-pointer transition-all ${
              selectedFile
                ? "border-emerald-300 bg-emerald-50/15"
                : isEdit
                ? "border-slate-200/80 hover:border-primary/40 hover:bg-slate-50/50"
                : "border-slate-200/80 hover:border-primary/40 hover:bg-slate-50/50"
            }`}
          >
            {selectedFile ? (
              <div className="flex flex-col items-center">
                <svg className="w-8 h-8 text-emerald-500 mb-2 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21a3.745 3.745 0 01-3.068-1.593 3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
                <p className="text-xs font-bold text-emerald-600 truncate max-w-xs">{selectedFile.name}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB (selected)
                </p>
              </div>
            ) : isEdit ? (
              <div className="flex flex-col items-center">
                <svg className="w-8 h-8 text-primary/70 mb-2 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-xs font-bold text-slate-500">
                  Currently attached: <span className="text-primary">{fileData?.fileName}</span>
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Click to choose a different file to replace it</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <svg className="w-8 h-8 text-slate-400 mb-2 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                <p className="text-xs font-bold text-slate-500">Click to browse patient documents</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">PDF, JPG, PNG, DOC up to 5MB</p>
              </div>
            )}
          </div>
        </div>

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

        {/* Document Name */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1">
            Document Name *
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => {
              setFileName(e.target.value);
              if (error) setError("");
            }}
            placeholder="e.g. Cervical Spine X-Ray"
            className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs text-secondary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium transition-all shadow-sm ${
              error && !fileName.trim() ? "border-rose-400 focus:border-rose-400" : "border-slate-200/70"
            }`}
          />
        </div>

        {/* Document Type Dropdown */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1.5">
            Document Type
          </label>
          <CustomSelect
            value={fileType}
            onChange={(val) => setFileType(val)}
            options={docTypeOptions}
            placeholder="Select Document Type"
          />
        </div>

        {/* Additional Notes */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-1">
            Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any extra clinical context or comments..."
            className="w-full bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-2.5 text-xs text-secondary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium transition-all shadow-sm resize-none"
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
            {submitting ? "Uploading..." : isEdit ? "Save Changes" : "Upload Document"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default DocFormModal;
