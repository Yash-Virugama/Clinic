import CustomSelect from "../../../components/CustomSelect/CustomSelect";

const AppointmentFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  onAdd,
}) => (
  <div className="bg-white border border-slate-200/60 p-4.5 rounded-3xl shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      <input
        type="text"
        placeholder="Search patient..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200/70 rounded-2xl pl-10 pr-14 py-2.5 text-xs text-secondary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium transition-all shadow-sm"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery("")}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary text-[10px] font-bold uppercase tracking-wider font-accent cursor-pointer"
        >
          Clear
        </button>
      )}
    </div>

    <CustomSelect
      value={statusFilter}
      onChange={(value) => setStatusFilter(value)}
      options={[
        { value: "all", label: "All Statuses" },
        { value: "scheduled", label: "Scheduled" },
        { value: "complete", label: "Complete" },
        { value: "missed", label: "Missed" },
        { value: "cancel", label: "Cancelled" },
      ]}
    />

    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      </span>
      <input
        type="date"
        value={dateFilter}
        onChange={(event) => setDateFilter(event.target.value)}
        className="w-full bg-slate-50 border border-slate-200/70 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-secondary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium transition-all shadow-sm cursor-pointer"
      />
      {dateFilter && (
        <button
          type="button"
          onClick={() => setDateFilter("")}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>

    <button
      onClick={onAdd}
      className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-2xl hover:bg-primary-hover shadow-md hover:shadow-lg transition-premium cursor-pointer shrink-0"
    >
      <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      Schedule Session
    </button>
  </div>
);

export default AppointmentFilters;
