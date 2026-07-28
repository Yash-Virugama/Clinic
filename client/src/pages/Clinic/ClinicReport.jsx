import React, { useEffect, useState } from "react";
import useClinicReport from "../../hooks/useClinicReport";
import ClinicSkeleton from "../../components/ClinicSkeleton/ClinicSkeleton";
import CustomSelect from "../../components/CustomSelect/CustomSelect";

const ClinicReport = () => {
  const { reportData, loading, fetchReportData } = useClinicReport();
  const [dateRangeOption, setDateRangeOption] = useState("this month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return <ClinicSkeleton type="details" />;
  }

  // Calculate percentages helper
  const getPercentage = (value, total) => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  };

  const {
    totalPatients,
    totalCases,
    totalAppointments,
    netRevenue,
    outstanding,
    caseStatus,
    appointmentCompletion,
    locationPreferences,
    outstandingPayments,
    therapistPerformance,
    todayVisits,
  } = reportData;

  const handleRangeChange = (opt) => {
    setDateRangeOption(opt);
    if (opt !== "custom") {
      fetchReportData(opt);
    }
  };

  const applyCustomRange = () => {
    if (!customStartDate || !customEndDate) return;
    fetchReportData("custom", customStartDate, customEndDate);
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header and Date Range Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-slate-200/60 p-5 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-heading text-semidarkblue leading-none">
            Clinic Performance
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto flex-wrap justify-end">
          <div className="w-full sm:w-48 shrink-0">
            <CustomSelect
              value={dateRangeOption}
              onChange={(value) => handleRangeChange(value)}
              options={[
                { value: "today", label: "Today" },
                { value: "this week", label: "This Week" },
                { value: "this month", label: "This Month" },
                { value: "last month", label: "Last Month" },
                { value: "this year", label: "This Year" },
                { value: "custom", label: "Custom Range" },
              ]}
            />
          </div>

          {dateRangeOption === "custom" && (
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 justify-start sm:justify-end">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-slate-450 uppercase font-accent">From</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="cursor-pointer bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 max-w-[130px]"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-slate-450 uppercase font-accent">To</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="cursor-pointer bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 max-w-[130px]"
                />
              </div>
              <button
                type="button"
                onClick={applyCustomRange}
                className="px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-primary-hover transition-all cursor-pointer shadow-sm shrink-0"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Headline Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/60 p-6 rounded-[24px] shadow-sm relative overflow-hidden">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-heading mb-2">Net Revenue</span>
          <span className="text-3.5xl font-extrabold text-emerald-600 font-heading tracking-tight leading-none">₹{netRevenue.toFixed(2)}</span>
          <div className="absolute right-4 bottom-4 text-emerald-100/80 font-extrabold text-5xl sm:text-4xl select-none font-heading">RV</div>
        </div>

        <div className="bg-white border border-slate-200/60 p-6 rounded-[24px] shadow-sm relative overflow-hidden">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-heading mb-2">Outstanding Balance</span>
          <span className="text-3.5xl font-extrabold text-rose-600 font-heading tracking-tight leading-none">₹{outstanding.toFixed(2)}</span>
          <div className="absolute right-4 bottom-4 text-rose-100/80 font-extrabold text-5xl sm:text-4xl select-none font-heading">OS</div>
        </div>

        <div className="bg-white border border-slate-200/60 p-6 rounded-[24px] shadow-sm relative overflow-hidden">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-heading mb-2">Total Patients Enrolled</span>
          <span className="text-3.5xl font-extrabold text-secondary font-heading tracking-tight leading-none">{totalPatients}</span>
          <div className="absolute right-4 bottom-4 text-slate-200/80 font-extrabold text-5xl sm:text-4xl select-none font-heading">PT</div>
        </div>
      </div>

      {/* Analytics Dashboard Grid - Two in a row for md, lg screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* 1. Today's Session Visits */}
        <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-[32px] shadow-sm order-1">
          <h3 className="text-md font-bold text-semidarkblue font-heading mb-6 flex items-center gap-2">
            📅 Today's Session Visits
          </h3>

          <div className="space-y-5">
            {/* Total Today */}
            <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-150/40 text-center mb-6">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-accent block">
                Total Visits Today
              </span>
              <span className="text-2xl font-black text-[#1e3a8a] mt-0.5 block">
                {todayVisits?.total || 0}
              </span>
            </div>

            {/* Completed */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-650">Completed Visits</span>
                <span className="text-secondary">{todayVisits?.completed || 0} ({getPercentage(todayVisits?.completed || 0, todayVisits?.total || 0)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${getPercentage(todayVisits?.completed || 0, todayVisits?.total || 0)}%` }}
                />
              </div>
            </div>

            {/* Scheduled */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-650">Upcoming Scheduled</span>
                <span className="text-secondary">{todayVisits?.scheduled || 0} ({getPercentage(todayVisits?.scheduled || 0, todayVisits?.total || 0)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${getPercentage(todayVisits?.scheduled || 0, todayVisits?.total || 0)}%` }}
                />
              </div>
            </div>

            {/* Cancelled */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-650">Cancelled Visits</span>
                <span className="text-secondary">{todayVisits?.cancelled || 0} ({getPercentage(todayVisits?.cancelled || 0, todayVisits?.total || 0)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${getPercentage(todayVisits?.cancelled || 0, todayVisits?.total || 0)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Outstanding Payments */}
        <div className="bg-white border border-slate-200/60 p-4.5 sm:p-8 rounded-[32px] shadow-sm order-2">
          <h3 className="text-md font-bold text-semidarkblue font-heading mb-6 flex items-center gap-2">
            💸 Outstanding Payments
          </h3>

          {outstandingPayments.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-emerald-500 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-sm font-bold text-slate-700">All Accounts Settled</h4>
              <p className="text-xs text-slate-500 mt-1">There are no pending balances across all cases at this time.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100">
                    <th className="ps-5 pe-15 sm:pe-5 py-3.5 text-[10px] font-bold text-slate-450 uppercase tracking-wider">Patient</th>
                    <th className="pe-15 sm:pe-5 py-3.5 text-[10px] font-bold text-slate-450 uppercase tracking-wider">Case</th>
                    <th className="pe-3.5 py-3.5 text-[10px] font-bold text-slate-450 uppercase tracking-wider">Total Fee</th>
                    <th className="ps-3 pe-5 py-3.5 text-[10px] font-bold text-slate-450 uppercase tracking-wider">Paid</th>
                    <th className="ps-3 pe-5 py-3.5 text-[10px] font-bold text-slate-450 uppercase tracking-wider">Unpaid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {outstandingPayments.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-5 py-3.5 text-xs font-bold text-slate-700">{p.patientName}</td>
                      <td className="pe-5 py-3.5 text-xs text-slate-650 font-medium">{p.caseName}</td>
                      <td className="pe-5 py-3.5 text-xs font-mono font-bold text-slate-650">₹{p.totalFee.toFixed(2)}</td>
                      <td className="ps-3 pe-5 py-3.5 text-xs font-mono font-bold text-emerald-600">₹{p.paid.toFixed(2)}</td>
                      <td className="ps-3 pe-5 py-3.5 text-xs font-mono font-bold text-rose-600">₹{p.unpaid.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 3. Case Status Distribution */}
        <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-[32px] shadow-sm order-3">
          <h3 className="text-md font-bold text-semidarkblue font-heading mb-6 flex items-center gap-2">
            📂 Case Status Distribution
          </h3>

          <div className="space-y-5">
            {/* Active */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-650">Active Cases</span>
                <span className="text-secondary">{caseStatus.active} ({getPercentage(caseStatus.active, totalCases)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${getPercentage(caseStatus.active, totalCases)}%` }}
                />
              </div>
            </div>

            {/* Closed */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-650">Closed / Completed Cases</span>
                <span className="text-secondary">{caseStatus.closed} ({getPercentage(caseStatus.closed, totalCases)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${getPercentage(caseStatus.closed, totalCases)}%` }}
                />
              </div>
            </div>

            {/* Suspended */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-650">Suspended Cases</span>
                <span className="text-secondary">{caseStatus.suspended} ({getPercentage(caseStatus.suspended, totalCases)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${getPercentage(caseStatus.suspended, totalCases)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Appointment Outcomes */}
        <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-[32px] shadow-sm order-4">
          <h3 className="text-md font-bold text-semidarkblue font-heading mb-6 flex items-center gap-2">
            🏁 Appointment Outcomes
          </h3>

          <div className="space-y-5">
            {/* Completed */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-650">Completed Sessions</span>
                <span className="text-secondary">{appointmentCompletion.completed} ({getPercentage(appointmentCompletion.completed, totalAppointments)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${getPercentage(appointmentCompletion.completed, totalAppointments)}%` }}
                />
              </div>
            </div>

            {/* Scheduled */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-650">Upcoming Scheduled</span>
                <span className="text-secondary">{appointmentCompletion.scheduled} ({getPercentage(appointmentCompletion.scheduled, totalAppointments)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${getPercentage(appointmentCompletion.scheduled, totalAppointments)}%` }}
                />
              </div>
            </div>

            {/* Missed */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-650">Missed Sessions</span>
                <span className="text-secondary">{appointmentCompletion.missed} ({getPercentage(appointmentCompletion.missed, totalAppointments)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${getPercentage(appointmentCompletion.missed, totalAppointments)}%` }}
                />
              </div>
            </div>

            {/* Cancelled */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-650">Cancelled Sessions</span>
                <span className="text-secondary">{appointmentCompletion.cancelled} ({getPercentage(appointmentCompletion.cancelled, totalAppointments)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-slate-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${getPercentage(appointmentCompletion.cancelled, totalAppointments)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 5. Location Preference Shares */}
        <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-[32px] shadow-sm order-5">
          <h3 className="text-md font-bold text-semidarkblue font-heading mb-6 flex items-center gap-2">
            📍 Location
          </h3>

          <div className="space-y-5">
            {/* Clinic */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-650">Clinic Center Visit</span>
                <span className="text-secondary">{locationPreferences.clinic} ({getPercentage(locationPreferences.clinic, totalAppointments)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${getPercentage(locationPreferences.clinic, totalAppointments)}%` }}
                />
              </div>
            </div>

            {/* Home */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-650">Home Session</span>
                <span className="text-secondary">{locationPreferences.home} ({getPercentage(locationPreferences.home, totalAppointments)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${getPercentage(locationPreferences.home, totalAppointments)}%` }}
                />
              </div>
            </div>

            {/* Online */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-650">Online Consult</span>
                <span className="text-secondary">{locationPreferences.online} ({getPercentage(locationPreferences.online, totalAppointments)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${getPercentage(locationPreferences.online, totalAppointments)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 6. Therapist Performance */}
        <div className="bg-white border border-slate-200/60 p-6 sm:p-8 rounded-[32px] shadow-sm order-6">
          <h3 className="text-md font-bold text-semidarkblue font-heading mb-6 flex items-center gap-2">
            🩺 Therapist Performance
          </h3>

          {!therapistPerformance || therapistPerformance.length === 0 ? (
            <div className="text-center py-10">
              <span className="text-xs text-slate-400 italic block">
                No session statistics conducted by therapists in this date range.
              </span>
            </div>
          ) : (
            <div className="space-y-6">
              {therapistPerformance.map((tp, idx) => {
                const totalSessionsCombined = therapistPerformance.reduce((sum, item) => sum + item.totalVisits, 0);
                const percentShare = totalSessionsCombined ? Math.round((tp.totalVisits / totalSessionsCombined) * 100) : 0;

                return (
                  <div key={idx} className="space-y-2.5 pb-5 border-b border-slate-100 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-700 font-bold">{tp.therapistName}</span>
                      <span className="text-slate-450 text-[10px] font-bold uppercase">{percentShare}% share</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentShare}%` }}
                      />
                    </div>

                    {/* Stats details row */}
                    <div className="grid grid-cols-3 gap-1.5 text-center bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[8px] font-extrabold uppercase text-slate-400 block">Total</span>
                        <span className="text-xs font-bold text-slate-700">{tp.totalVisits}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-extrabold uppercase text-slate-400 block">Done</span>
                        <span className="text-xs font-bold text-emerald-600">{tp.completedVisits}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-extrabold uppercase text-slate-400 block">Patients</span>
                        <span className="text-xs font-bold text-indigo-600">{tp.uniquePatients}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-medium text-slate-500 pt-1">
                      <span>Paid: <strong className="text-emerald-600">₹{tp.revenue.toFixed(2)}</strong></span>
                      <span>Unpaid: <strong className="text-rose-600">₹{tp.outstanding.toFixed(2)}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ClinicReport;
