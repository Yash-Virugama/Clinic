import React, { useState } from "react";
import ModalShell from "./ModalShell";

const AddNoteModal = ({ isOpen, onClose, onSubmit, submitting }) => {
  const [noteType, setNoteType] = useState("general");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.trim()) {
      setError("Note content cannot be empty.");
      return;
    }
    if (note.length > 1000) {
      setError("Note cannot exceed 1000 characters.");
      return;
    }
    
    setError("");
    onSubmit({ noteType, note: note.trim() });
    setNote("");
    setNoteType("general");
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title="Add Internal Note">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Note Type Selector */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent block mb-2.5">
            Note Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setNoteType("general")}
              className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center ${
                noteType === "general"
                  ? "bg-blue-50 border-blue-400 text-blue-600 shadow-sm"
                  : "bg-white border-slate-200/70 text-slate-500 hover:bg-slate-50"
              }`}
            >
              General
            </button>
            <button
              type="button"
              onClick={() => setNoteType("alert")}
              className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center ${
                noteType === "alert"
                  ? "bg-rose-50 border-rose-400 text-rose-600 shadow-sm"
                  : "bg-white border-slate-200/70 text-slate-500 hover:bg-slate-50"
              }`}
            >
              Alert
            </button>
          </div>
        </div>

        {/* Note Content Textarea */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-accent">
              Note Content
            </label>
            <span className={`text-[9px] font-bold ${note.length > 900 ? "text-rose-500" : "text-slate-400"}`}>
              {note.length}/1000
            </span>
          </div>
          <textarea
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              if (error) setError("");
            }}
            placeholder="Write clinical alerts, precautions, or general patient workspace updates..."
            rows={4}
            className={`w-full bg-slate-50 border rounded-2xl px-4 py-3 text-xs text-secondary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium transition-all shadow-sm resize-none ${
              error ? "border-rose-400 focus:border-rose-400" : "border-slate-200/70"
            }`}
          />
          {error && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider mt-1">{error}</p>}
        </div>

        {/* Buttons */}
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
            {submitting ? "Saving..." : "Save Note"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default AddNoteModal;
