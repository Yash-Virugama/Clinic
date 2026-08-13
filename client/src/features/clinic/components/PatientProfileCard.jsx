import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Icon = ({ name, className = "w-4 h-4" }) => {
  const common = { className, fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24" };

  if (name === "phone") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-1.514 2.018a15 15 0 01-6.989-6.989l2.018-1.514c.361-.27.527-.732.417-1.173L6.963 3.102A1.125 1.125 0 005.872 2.25H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>;
  }
  if (name === "mail") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5A2.25 2.25 0 0119.5 19.5h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" /></svg>;
  }
  if (name === "calendar") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M5.25 5.25h13.5A2.25 2.25 0 0121 7.5v11.25A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V7.5a2.25 2.25 0 012.25-2.25z" /></svg>;
  }
  if (name === "building") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M5.25 21V4.5A1.5 1.5 0 016.75 3h10.5a1.5 1.5 0 011.5 1.5V21M8.25 7.5h1.5m4.5 0h1.5m-7.5 4.5h1.5m4.5 0h1.5m-7.5 4.5h1.5m4.5 0h1.5" /></svg>;
  }
  if (name === "heart") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733C11.285 4.876 9.623 3.75 7.688 3.75 5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>;
  }
  if (name === "user") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0" /></svg>;
  }
  if (name === "id") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5v13.5H3.75V5.25zM7.5 9h3m-3 3h3m4.5-3h2.25m-2.25 3h2.25m-9.75 3h9.75" /></svg>;
  }
  if (name === "edit") {
    return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.651-1.65a1.875 1.875 0 112.652 2.651L9.75 16.904 6 18l1.096-3.75L18.512 2.837z" /></svg>;
  }
  return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M12 17v-6m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const ProfileRow = ({ icon, label, value }) => (
  <div className="grid grid-cols-[28px_110px_1fr] sm:grid-cols-[32px_130px_1fr] gap-2 items-center py-2.5 border-b border-slate-100 last:border-0 text-xs">
    <Icon name={icon} className="w-4 h-4 text-slate-400" />
    <span className="text-slate-500 font-semibold">{label}</span>
    <span className="text-secondary font-bold truncate">{value || "—"}</span>
  </div>
);

const PatientProfileCard = ({ patient, patientCode, settings, selectedCase, onEdit, isActive }) => {
  const { user } = useAuth();
  const clinicPrefix = user?.role === "admin" ? "/clinic" : `/staff/${user?.role}/clinic`;

  return (
    <section className="bg-white border border-slate-200/50 rounded-[28px] shadow-sm p-6">
      <div className="flex gap-5 items-center">
        <div className="w-15 h-15 sm:w-20 sm:h-20 rounded-full bg-primary/10 ring-4 ring-primary/5 text-primary flex items-center justify-center text-2xl font-bold font-accent shrink-0">
          {getInitials(patient.name)}
        </div>

        <div>
          <div className="flex items-center gap-1.5 justify-center">
            <h2 className="text-base font-bold text-secondary">{patient.name}</h2>
            <button
              onClick={onEdit}
              className="text-slate-400 hover:text-primary flex items-center justify-center transition-colors cursor-pointer"
              title="Edit patient"
            >
              <Icon name="edit" className="w-4 h-4" />
            </button>
            <Link
              to={`${clinicPrefix}/payments/${patient._id}`}
              className="text-slate-400 hover:text-primary flex items-center justify-center transition-colors cursor-pointer text-sm font-bold ml-0.5"
              title="View billing and payments"
            >
              ₹
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-2 py-0.5 rounded border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider bg-primary/5">
              {patientCode ? patientCode.toUpperCase() : "—"}
            </span>
            {isActive ? (
              <span className="px-2 py-0.5 rounded border border-emerald-200 text-emerald-600 text-[10px] font-bold uppercase tracking-wider bg-emerald-50/50">
                Active
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded border border-amber-200 text-amber-500 text-[10px] font-bold uppercase tracking-wider bg-amber-50">
                Inactive
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="my-5 border-t border-slate-100" />

      <div className="space-y-1">
        <ProfileRow icon="user" label="Age / Gender" value={`${patient.age !== undefined ? patient.age : "--"} / ${patient.gender}`} />
        {/* <ProfileRow icon="calendar" label="Date of Birth" value="—" /> */}
        <ProfileRow icon="phone" label="Phone" value={patient.phone} />
        {/* <ProfileRow icon="mail" label="Email" value="—" /> */}
        {/* <ProfileRow icon="building" label="Branch" value={settings?.name ? `${settings.name} - Main Branch` : "Main Branch"} /> */}
        <ProfileRow
          icon="calendar"
          label="Registered"
          value={patient.createdAt ? new Date(patient.createdAt).toLocaleDateString("en-GB").replace(/\//g, "-") : "—"}
        />
        {/* <ProfileRow icon="heart" label="Blood Group" value="—" /> */}
        <ProfileRow
          icon="user"
          label="Consult Dr."
          value={selectedCase?.consultingDoctor?.name ? `${selectedCase.consultingDoctor.name}` : "—"}
        />
        <ProfileRow icon="id" label="ID" value={patientCode ? patientCode.toUpperCase() : "—"} />
      </div>
    </section>
  );
};

export default PatientProfileCard;
