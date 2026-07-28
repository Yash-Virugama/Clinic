import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import ClinicSkeleton from "../../components/ClinicSkeleton/ClinicSkeleton";
import ClinicPagination from "../../features/clinic/components/ClinicPagination";
import useClinicPagination from "../../features/clinic/hooks/useClinicPagination";
import toast from "react-hot-toast";
import { useBranding } from "../../context/BrandingContext";
import { generateClinicPatientId } from "../../features/clinic/utils/clinicFormatters";

const ClinicUnpaidCases = () => {
  const navigate = useNavigate();
  const { settings } = useBranding();
  const getPatientCode = (pId) => generateClinicPatientId(pId, settings?.name);
  const [unpaidCases, setUnpaidCases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const getStatusClasses = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200";
      case "Resolved":
        return "bg-blue-50 text-blue-600 border border-blue-200";
      case "Cancelled":
        return "bg-amber-50 text-amber-600 border border-amber-200";
      case "Closed":
        return "bg-rose-50 text-rose-600 border border-rose-200";
      default:
        return "bg-slate-50 text-slate-650 border border-slate-200";
    }
  };

  const fetchUnpaidCases = async () => {
    try {
      setLoading(true);
      const [casesRes, visitsRes] = await Promise.all([
        api.get("/clinic/cases"),
        api.get("/clinic/visits"),
      ]);

      const allCases = casesRes.data || [];
      const allVisits = visitsRes.data || [];

      // Calculate unpaid amount for each case
      const casesWithBalances = allCases.map((c) => {
        const caseVisits = allVisits.filter(
          (v) => (v.clinicCase?._id || v.clinicCase) === c._id
        );
        const paid = caseVisits.reduce(
          (acc, v) => (v.paymentStatus === "Paid" ? acc + (v.paymentAmount || 0) : acc),
          0
        );
        const unpaid = caseVisits.reduce(
          (acc, v) => (v.paymentStatus !== "Paid" ? acc + (v.paymentAmount || 0) : acc),
          0
        );
        const therapistName = c.therapist?.name || (caseVisits[0]?.therapist?.name) || "Unassigned";

        return {
          ...c,
          paid,
          unpaid,
          therapistName,
          patientName: c.patient?.name || "Unknown Patient",
          patientId: c.patient?._id || c.patient,
        };
      });

      // Filter to only cases with an unpaid balance > 0
      const filteredUnpaid = casesWithBalances.filter((c) => c.unpaid > 0);

      // Sort by unpaid balance descending (highest outstanding first)
      filteredUnpaid.sort((a, b) => b.unpaid - a.unpaid);

      setUnpaidCases(filteredUnpaid);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load unpaid cases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnpaidCases();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = unpaidCases.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.patientName.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.therapistName.toLowerCase().includes(q)
    );
  });

  const {
    currentPage,
    pageItems: paginatedCases,
    totalPages,
    handlePageChange,
  } = useClinicPagination(filtered, 15, searchQuery);

  if (loading) {
    return <ClinicSkeleton type="details" />;
  }

  return (
    <div className="space-y-6 text-left animate-page-entrance">

      {/* Header and Back Button */}
      <div className="flex items-center gap-3 w-full sm:w-auto py-1">
        <Link
          to="/clinic"
          className="group flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-primary hover:border-primary shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 shrink-0"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>

        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none text-slate-400 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search unpaid cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl ps-9 pe-14 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
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
      </div>

      {/* Unpaid Cases Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-[32px] p-16 shadow-sm text-center">
          <svg className="w-16 h-16 text-emerald-500 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-base font-bold text-secondary mb-1">No Unpaid Balance</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto text-center">
            {searchQuery ? "No unpaid cases match your search query." : "All patient accounts are fully settled. There are no outstanding balances."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {paginatedCases.map((c) => {
              return (
                <div
                  key={c._id}
                  onClick={() => {
                    if (c.patientId) {
                      navigate(`/clinic/payments/${c.patientId}?openCase=${c._id}`);
                    } else {
                      toast.error("Patient details not found for this case");
                    }
                  }}
                  className="bg-white border border-slate-100 hover:border-primary/20 rounded-[28px] p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[170px]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-base font-bold tracking-tight text-semidarkblue transition-colors font-heading leading-tight">
                        {c.patientName}
                      </h4>
                      {c.patientId && (
                        <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold tracking-wider block mt-0.5">
                          {getPatientCode(c.patientId).toUpperCase()}
                        </span>
                      )}
                      <p className="mt-4 text-xs text-slate-500 font-medium">
                        Case: <span className="text-slate-650 font-bold">{c.title}</span>
                      </p>
                      <span className="text-xs text-slate-500 font-medium">
                        Paid: <strong className="text-emerald-600 font-bold font-mono">₹{c.paid.toFixed(2)}</strong>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-medium">Unpaid</span>
                      <span className="text-base font-mono font-black text-rose-600">
                        ₹{c.unpaid.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 sm:pt-4 sm:mt-4 border-t border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="flex gap-2 iteams-center">
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      <span className="text-xs text-slate-500 font-bold">
                        {c.therapistName}
                      </span>
                    </div>

                    <div className="flex gap-1.5">
                      <span className={`inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider ${getStatusClasses(c.status || "Active")} px-2 py-0.5 rounded-lg`}>
                        {c.status || "-"}
                      </span>
                      {/* <span className="text-[10px] text-slate-400 font-medium">
                        Paid: <strong className="text-emerald-600 font-mono">₹{c.paid.toFixed(2)}</strong>
                      </span> */}
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

export default ClinicUnpaidCases;
