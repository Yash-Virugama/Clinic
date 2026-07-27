import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClinicSkeleton from "../../components/ClinicSkeleton/ClinicSkeleton";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import { useBranding } from "../../context/BrandingContext";
import { useClinic } from "../../context/ClinicContext";
import ClinicPagination from "../../features/clinic/components/ClinicPagination";
import { generateClinicPatientId } from "../../features/clinic/utils/clinicFormatters";
import useClinicPagination from "../../features/clinic/hooks/useClinicPagination";

const PAYMENTS_PER_PAGE = 15;

const ClinicPayments = () => {
  const navigate = useNavigate();
  const { settings } = useBranding();
  const { patients, loadingPatients, fetchPatients } = useClinic();
  const [searchQuery, setSearchQuery] = useState("");
  const [billingFilter, setBillingFilter] = useState("all");

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPatientCode = (patientId) => generateClinicPatientId(patientId, settings?.name);

  // Filter patients by name, phone or code AND billing status
  const filteredPatients = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return (patients || [])
      .filter((patient) => {
        const matchesQuery =
          patient.name.toLowerCase().includes(query) ||
          patient.phone.includes(query) ||
          getPatientCode(patient._id).toLowerCase().includes(query);

        let matchesBilling = true;
        if (billingFilter === "unpaid") {
          matchesBilling = (patient.totalUnpaid || 0) > 0;
        } else if (billingFilter === "paid") {
          matchesBilling = (patient.totalUnpaid || 0) === 0;
        }

        return matchesQuery && matchesBilling;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [patients, searchQuery, billingFilter, settings?.name]);

  const {
    currentPage,
    pageItems: displayedPatients,
    totalPages,
    handlePageChange,
  } = useClinicPagination(filteredPatients, PAYMENTS_PER_PAGE, searchQuery);

  const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "—";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  return (
    <div className="space-y-8 relative text-left">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full sm:w-80 shrink-0">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search patient name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200/80 rounded-xl pl-10 pr-14 py-2.5 text-xs text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium transition-all shadow-sm"
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

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          <div className="w-full sm:w-44 shrink-0">
            <CustomSelect
              value={billingFilter}
              onChange={(value) => setBillingFilter(value)}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "unpaid", label: "Unpaid" },
                { value: "paid", label: "Fully Settled" },
              ]}
            />
          </div>
        </div>
      </div>

      {loadingPatients ? (
        <ClinicSkeleton type="grid" count={6} />
      ) : filteredPatients.length === 0 ? (
        <div className="bg-white border border-slate-200/60 p-12 rounded-[32px] text-center max-w-xl mx-auto shadow-sm">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 5h12M6 9h12M9 5v8c3 0 6-1 6-4s-3-4-6-4M9 13l8 8" />
          </svg>
          <h3 className="text-base font-bold text-secondary mb-1">No Payments Found</h3>
          <p className="text-xs text-slate-500">
            {searchQuery || billingFilter !== "all" ? "No patient billing records match your filter criteria." : "Register patients and log visits to start tracking payments."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPatients.map((patient) => {
              const code = getPatientCode(patient._id);
              return (
                <div
                  key={patient._id}
                  onClick={() => navigate(`/clinic/payments/${patient._id}`)}
                  className="bg-white border hover:-translate-y-1 border-slate-200/60 p-5 rounded-3xl shadow-sm hover:shadow-md hover:border-primary/20 transition-premium cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Top Identity Row */}
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 uppercase text-slate-500 font-bold text-[9px] font-bold rounded border border-slate-200">
                        {code}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded border font-accent ${patient.isActive
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-amber-50 text-amber-500 border-amber-200"
                          }`}>
                          {patient.isActive ? "Active" : "Inactive"}
                        </span>
                        <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded border font-accent ${patient.gender === "Male"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : patient.gender === "Female"
                              ? "bg-purple-50 text-purple-600 border-purple-100"
                              : "bg-amber-50 text-amber-600 border-amber-100"
                          }`}>
                          {patient.gender}
                        </span>
                      </div>
                    </div>

                    {/* Patient Info Row */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                        {getInitials(patient.name)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-heading font-bold text-semidarkblue leading-snug truncate">
                          {patient.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{patient.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Breakdown Cards */}
                  <div className="mt-5 grid grid-cols-2 gap-3.5">
                    {/* Paid Block */}
                    <div className="bg-emerald-50/20 border border-emerald-100 rounded-2xl p-3 text-center">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-500/80 font-accent block">
                        Total Paid
                      </span>
                      <span className="text-sm font-black text-emerald-600 block mt-1">
                        ₹{(patient.totalPaid || 0).toFixed(2)}
                      </span>
                    </div>

                    {/* Unpaid Block */}
                    <div className="bg-rose-50/20 border border-rose-100 rounded-2xl p-3 text-center">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-rose-500/80 font-accent block">
                        Total Unpaid
                      </span>
                      <span className="text-sm font-black text-rose-600 block mt-1">
                        ₹{(patient.totalUnpaid || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <ClinicPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default ClinicPayments;
