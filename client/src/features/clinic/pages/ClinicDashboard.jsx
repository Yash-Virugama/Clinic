import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useClinicDashboard from "../hooks/useClinicDashboard";
import ClinicSkeleton from "../components/ClinicSkeleton";
import { useAuth } from "../../../context/AuthContext";

const ClinicDashboard = () => {
  const { metrics, upcomingAppointments, recentPatients, loading } = useClinicDashboard();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return <ClinicSkeleton type="grid" count={4} />;
  }

  const clinicPrefix = user?.role === "admin" ? "/clinic" : `/staff/${user?.role}/clinic`;

  const statCards = [

    {
      title: "Today's Visits",
      count: metrics.visitsToday,
      to: `${clinicPrefix}/dashboard/visits`,
      label: "View Sessions",
      color: "border-slate-200/60",
      icon: (
        <svg className="w-6 h-6 text-primary stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      title: "Today's Appointments",
      count: metrics.appointmentsToday,
      to: `${clinicPrefix}/dashboard/appointments`,
      label: "View Schedule",
      color: "border-slate-200/60",
      icon: (
        <svg className="w-6 h-6 text-primary stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      )
    },
    {
      title: "Unpaid Payments",
      count: metrics.unpaidPayments,
      to: `${clinicPrefix}/unpaid`,
      label: "View Payments",
      color: "border-slate-200/60",
      icon: (
        <svg className="w-6 h-6 text-primary stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5zm13.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      )
    },
    {
      title: "Tomorrow's Sessions",
      count: metrics.visitsTomorrow,
      to: `${clinicPrefix}/dashboard/tomorrow-visits`,
      label: "View Sessions",
      color: "border-slate-200/60",
      icon: (
        <svg className="w-6 h-6 text-primary stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];
  const displayedAppointments = isExpanded ? upcomingAppointments : upcomingAppointments.slice(0, 5);

  return (
    <div className="flex flex-col gap-8 text-left animate-page-entrance">

      {/* 1. Greeting Banner */}
      <div className="w-full bg-white border border-slate-200/60 rounded-[32px] p-6 sm:p-10 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="shrink-0 w-full h-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200/50 text-center sm:text-right shadow-inner">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block leading-none mb-1 font-accent">
            Current Date
          </span>
          <span className="text-xs font-bold text-secondary font-heading">
            {currentDate}
          </span>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <Link
            key={idx}
            to={card.to}
            className={`group bg-white border p-6 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-250 flex flex-col justify-between h-[95px] sm:h-40 ${card.color}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading leading-tight">
                  {card.title}
                </span>
                <span className="sm:hidden text-4.5xl font-extrabold text-secondary font-heading tracking-tight leading-none">
                  {card.count}
                </span>
              </div>
              <div className="p-2.5 rounded-2xl border bg-primary/5 border-primary/10 group-hover:border-primary/20 transition-colors">
                {card.icon}
              </div>
            </div>

            <div className="mt-2 hidden sm:block">
              <span className="text-4.5xl font-extrabold text-secondary font-heading tracking-tight leading-none">
                {card.count}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:mt-2 text-[9px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-primary transition-colors">
              <span className="hidden sm:block">{card.label}</span>
              <svg className="hidden sm:block w-3 h-3 stroke-[2.2] transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* 3. Columns: Upcoming Sessions and Quick Navigation */}
      <div className="grid grid-cols-1 gap-8">

        {/* Left: Upcoming agenda list */}
        <div className="lg:col-span-8 bg-white border border-slate-200/60 rounded-[32px] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-semidarkblue font-heading mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Upcoming Sessions
            </h3>

            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                No upcoming scheduled appointments today.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 ps-2 pe-15 sm:px-3">Patient</th>
                      <th className="py-3 ps-2 pe-10 sm:px-3">Therapist</th>
                      <th className="py-3 ps-2 pe-18 sm:px-2">Date</th>
                      <th className="py-3 ps-4 pe-2 sm:px-2">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedAppointments.map((appt) => (
                      <tr
                        key={appt._id}
                        onClick={() => navigate(`${clinicPrefix}/patients/${appt.patient?._id || appt.patient}`)}
                        className="border-b border-slate-200/80 hover:bg-slate-50/50 transition-colors cursor-pointer"
                      >
                        <td className="py-3.5 px-2 font-semibold text-secondary">{appt.patient?.name}</td>
                        <td className="py-3.5 px-2 text-slate-650">{appt.therapist?.name}</td>
                        <td className="py-3.5 px-2 font-mono text-slate-500">
                          <span>{new Date(appt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} @ {appt.time}</span>
                        </td>
                        <td className="py-3.5 ps-4 pe-2 sm:px-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${appt.location === "clinic"
                            ? "bg-blue-50 text-blue-600 border-blue-200"
                            : appt.location === "home"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-purple-50 text-purple-600 border-purple-200"
                            }`}>
                            {appt.location}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {upcomingAppointments.length > 5 && (
            <div className="mt-6 text-right">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-bold text-primary hover:text-primary-hover uppercase tracking-wider flex items-center justify-end gap-1.5 cursor-pointer ml-auto"
              >
                {isExpanded ? "Show Less" : "View All"}
                <svg className={`w-4 h-4 transform transition-transform duration-250 ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Right: Recent Patients */}
        <div className="lg:col-span-4 bg-white border border-slate-200/60 rounded-[32px] p-6 sm:p-8 shadow-sm h-fit w-full md:max-w-[450px]">
          <h3 className="text-base font-bold text-semidarkblue font-heading mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Recent Patients
          </h3>

          {recentPatients.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs italic">
              No recent patient visits logged yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-200/80 max-h-[380px] overflow-y-auto pr-1">
              {recentPatients.map((rp) => (
                <Link
                  key={rp._id}
                  to={`${clinicPrefix}/patients/${rp._id}`}
                  className="flex items-center justify-between py-3 hover:bg-slate-50/50 transition-all duration-200 group"
                >
                  <div className="text-left">
                    <span className="text-xs font-bold text-secondary group-hover:text-primary transition-colors block">
                      {rp.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                      Phone: {rp.phone}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[8px] font-extrabold text-slate-400 block uppercase tracking-wider font-accent">
                      Last Session
                    </span>
                    <span className="text-[10px] font-bold text-semidarkblue block mt-0.5 font-mono">
                      {new Date(rp.lastVisitDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} @ {rp.lastVisitTime || "---"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default ClinicDashboard;
