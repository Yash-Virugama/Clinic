const PatientCard = ({ patient, patientCode, onClick, onDelete }) => (
  <div
    onClick={onClick}
    className="bg-white border border-slate-200/60 p-5 hover:-translate-y-1 rounded-3xl shadow-sm hover:shadow-md hover:border-primary/20 transition-premium cursor-pointer relative overflow-hidden flex flex-col justify-between"
  >
    <div className="space-y-3">
      <div className="flex justify-between items-start gap-2">
        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 uppercase font-bold text-[9px] font-bold rounded border border-slate-200">
          {patientCode}
        </span>
        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded font-accent border ${patient.isActive
            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
            : "bg-amber-50 text-amber-500 border-amber-200"
            }`}>
            {patient.isActive ? "Active" : "Inactive"}
          </span>
          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded font-accent border ${patient.gender === "Male"
            ? "bg-blue-50 text-blue-600 border-blue-100"
            : patient.gender === "Female"
              ? "bg-purple-50 text-purple-600 border-purple-100"
              : "bg-amber-50 text-amber-600 border-amber-100"
            }`}>
            {patient.gender}
          </span>
        </div>
      </div>

      <h3 className="text-base font-bold font-heading text-semidarkblue line-clamp-1">
        {patient.name}
      </h3>
    </div>

    <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-slate-200/80 space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-1.514 2.018a14.992 14.992 0 01-6.989-6.989l2.018-1.514c.361-.27.527-.732.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          {patient.phone}
        </span>

        <div className="flex gap-2.5">
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            {patient.notes?.length || 0} notes
          </span>

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(patient._id);
              }}
              className="w-6 h-6 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Delete Patient"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default PatientCard;
