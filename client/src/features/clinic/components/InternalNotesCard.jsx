import React from "react";

const Icon = ({ name, className = "w-4 h-4" }) => {
  const common = { className, fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24" };

  if (name === "chat") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12h.01M12 12h.01M16.5 12h.01M21 12c0 3.314-4.03 6-9 6a10.5 10.5 0 01-3.22-.5L3 19.5l1.69-4.23A5.34 5.34 0 013 12c0-3.314 4.03-6 9-6s9 2.686 9 6z" /></svg>;
  }
  if (name === "plus") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" /></svg>;
  }
  return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M12 17v-6m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
};

const EmptyState = () => (
  <div className="min-h-[160px] flex flex-col items-center justify-center text-center px-4 py-8 bg-slate-50/20 rounded-2xl border border-slate-100">
    <Icon name="chat" className="w-10 h-10 text-slate-300 mb-3" />
    <h3 className="text-xs font-bold text-slate-400">No internal notes yet.</h3>
    <p className="text-[10px] text-slate-400 mt-0.5">Click 'Add Note' to register a warning, precaution, or notification.</p>
  </div>
);

const InternalNotesCard = ({ notes, onAddClick, onDelete, saving, formatDate }) => {
  return (
    <div className="border border-slate-200/50 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Card Header */}
      <div className="px-5 py-3.5 bg-slate-50/50 border-b border-slate-150 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-500">
          <Icon name="chat" className="w-4 h-4" />
          <h2 className="text-xs font-bold uppercase tracking-wider">Internal Notes</h2>
        </div>
        <button
          type="button"
          onClick={onAddClick}
          disabled={saving}
          className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1 cursor-pointer disabled:opacity-50"
        >
          <Icon name="plus" className="w-3.5 h-3.5" />
          Add Note
        </button>
      </div>

      {/* Card Body */}
      {(!notes || notes.length === 0) ? (
        <div className="p-5">
          <EmptyState />
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {notes.map((note) => (
            <div key={note._id} className="p-4 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                  note.noteType === "alert"
                    ? "bg-rose-50 text-rose-600 border-rose-100"
                    : "bg-blue-50 text-blue-600 border-blue-100"
                }`}>
                  {note.noteType || "general"}
                </span>
                <p className="text-xs text-secondary font-medium whitespace-pre-wrap leading-relaxed">
                  {note.note}
                </p>
                <p className="text-[10px] text-slate-400 font-semibold font-accent">
                  {formatDate ? formatDate(note.createdAt) : new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDelete(note._id)}
                disabled={saving}
                className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternalNotesCard;
