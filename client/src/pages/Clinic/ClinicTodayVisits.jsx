import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import ClinicSkeleton from "../../components/ClinicSkeleton/ClinicSkeleton";
import ClinicPagination from "../../features/clinic/components/ClinicPagination";
import useClinicPagination from "../../features/clinic/hooks/useClinicPagination";
import toast from "react-hot-toast";
import CustomConfirmModal from "../../components/CustomConfirmModal/CustomConfirmModal";
import { formatTimeRange, generateClinicPatientId } from "../../features/clinic/utils/clinicFormatters";
import { useBranding } from "../../context/BrandingContext";

const ClinicTodayVisits = () => {
  const navigate = useNavigate();
  const { settings } = useBranding();
  const [visits, setVisits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const getPatientCode = (pId) => generateClinicPatientId(pId, settings?.name);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
  });

  const triggerDeleteVisit = (visitId) => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Delete Visit",
      message: "Are you sure you want to permanently delete this logged visit? This action cannot be undone.",
      onConfirm: () => handleConfirmDeleteVisit(visitId),
    });
  };

  const handleConfirmDeleteVisit = async (visitId) => {
    try {
      setSaving(true);
      await api.delete(`/clinic/visits/${visitId}`);
      toast.success("Visit deleted successfully");
      setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      fetchTodayVisits();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete visit");
    } finally {
      setSaving(false);
    }
  };

  const fetchTodayVisits = async () => {
    try {
      setLoading(true);
      const res = await api.get("/clinic/visits");
      const allVisits = res.data || [];
      const todayStr = new Date().toDateString();
      const filtered = allVisits.filter((v) => {
        if (!v.visitDate) return false;
        return new Date(v.visitDate).toDateString() === todayStr;
      });
      // Sort by visit time
      filtered.sort((a, b) => (a.visitTime || "").localeCompare(b.visitTime || ""));
      setVisits(filtered);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load today's visits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayVisits();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredVisits = visits.filter((v) => {
    const q = searchQuery.toLowerCase();
    const patientName = v.clinicCase?.patient?.name || "";
    const caseTitle = v.clinicCase?.title || "";
    const therapistName = v.therapist?.name || "";
    return (
      patientName.toLowerCase().includes(q) ||
      caseTitle.toLowerCase().includes(q) ||
      therapistName.toLowerCase().includes(q)
    );
  });

  const {
    currentPage,
    pageItems: paginatedVisits,
    totalPages,
    handlePageChange,
  } = useClinicPagination(filteredVisits, 15, searchQuery);

  if (loading) {
    return <ClinicSkeleton type="details" />;
  }

  return (
    <div className="space-y-6 text-left animate-page-entrance">
      {/* Header and Back Button */}
      <div className="flex items-center gap-3 w-full sm:w-auto py-1">
        <Link
          to="/clinic"
          className="group flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-full text-slate-650 hover:text-primary hover:border-primary shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 shrink-0"
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
            placeholder="Search visits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl ps-9 pe-14 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
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

      {/* Visits List - Cards Layout */}
      {filteredVisits.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-[32px] p-16 shadow-sm text-center">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h3 className="text-base font-bold text-secondary mb-1">No Visits Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto text-center">
            {searchQuery ? "No visits match your search query." : "There are no patient sessions logged or scheduled for today's date yet."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {paginatedVisits.map((visit) => (
              <TodayVisitCard
                key={visit._id}
                visit={visit}
                patientCode={visit.clinicCase?.patient?._id ? getPatientCode(visit.clinicCase.patient._id).toUpperCase() : ""}
                navigate={navigate}
                onRefresh={fetchTodayVisits}
                onDelete={() => triggerDeleteVisit(visit._id)}
              />
            ))}
          </div>

          <ClinicPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Delete Confirmation Modal */}
      <CustomConfirmModal
        isOpen={confirmModalConfig.isOpen}
        onClose={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModalConfig.onConfirm}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        isLoading={saving}
      />
    </div>
  );
};

const TodayVisitCard = ({ visit, patientCode, navigate, onRefresh, onDelete }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowStatusMenu(false);
      }
    };
    if (showStatusMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusMenu]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      await api.put(`/clinic/visits/${visit._id}`, { status: newStatus });
      toast.success(`Visit status updated to ${newStatus}`);
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = () => {
    onDelete();
  };

  const patientId = visit.clinicCase?.patient?._id || visit.clinicCase?.patient;
  const patientName = visit.clinicCase?.patient?.name || "Unknown Patient";

  return (
    <div
      onClick={() => {
        if (patientId) {
          navigate(`/clinic/patients/${patientId}`);
        } else {
          toast.error("Patient details not found for this visit");
        }
      }}
      className="bg-white border border-slate-100 hover:border-primary/20 rounded-[28px] p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[170px] relative text-left"
    >
      <div className="space-y-3.5 flex items-start justify-between gap-4">
        <div>
          <h4 className="text-base font-bold tracking-tight text-semidarkblue transition-colors font-heading leading-tight pt-1">
            {patientName}
          </h4>
          {patientCode && (
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold tracking-wider block mt-0.5">
              {patientCode}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-base font-mono font-black transition-colors ${visit.paymentStatus === "Paid" ? "text-emerald-600" : "text-rose-600"
            }`}>
            ₹{(visit.paymentAmount || 0).toFixed(2)}
          </span>

          {/* Three dots dropdown */}
          <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="w-4 h-4 text-slate-400 hover:text-primary flex items-center justify-center shrink-0 transition-all cursor-pointer"
              title="Change Status"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
            {showStatusMenu && (
              <div className="absolute right-6 -top-12 sm:-top-5 sm:right-5 mt-1.5 w-36 bg-white border border-slate-200/80 backdrop-blur-md rounded-2xl shadow-xl py-1.5 z-50 animate-page-entrance slide-in-from-top-1 duration-200">
                {/* Scheduled */}
                <button
                  onClick={() => {
                    setShowStatusMenu(false);
                    if (visit.status !== "Scheduled") handleUpdateStatus("Scheduled");
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-indigo-600 hover:bg-indigo-50/40 transition-colors"
                >
                  Scheduled
                </button>

                {/* Completed */}
                <button
                  onClick={() => {
                    setShowStatusMenu(false);
                    if (visit.status !== "Completed") handleUpdateStatus("Completed");
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-emerald-600 hover:bg-emerald-50/40 transition-colors"
                >
                  Completed
                </button>

                {/* Cancelled */}
                <button
                  onClick={() => {
                    setShowStatusMenu(false);
                    if (visit.status !== "Cancelled") handleUpdateStatus("Cancelled");
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-rose-600 hover:bg-rose-50/40 transition-colors"
                >
                  Cancelled
                </button>

                {/* Divider */}
                <div className="border-t border-slate-200 my-0.5"></div>

                {/* Delete */}
                <button
                  onClick={() => {
                    setShowStatusMenu(false);
                    handleDelete();
                  }}
                  className="cursor-pointer w-full text-left px-4.5 py-2 text-xs font-extrabold font-accent text-amber-600 hover:bg-amber-50/40 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col iteams-center gap-2 text-xs text-slate-500 font-medium">
        <p>
          Case: <span className="text-slate-655 font-bold">{visit.clinicCase?.title || "—"}</span>
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <span>{visit.visitTime ? formatTimeRange(visit.visitTime, visit.duration) : "—"}</span>
          <span className="text-[11px] text-slate-400 font-medium bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg">
            {visit.duration || 30}min {visit.location === "home" ? "at home" : visit.location === "clinic" ? "at clinic" : "online"}
          </span>

        </div>
      </div>

      <div className="pt-3 mt-3 sm:pt-4 sm:mt-4 border-t border-slate-200/80 flex items-center justify-between gap-2">

        <div className="flex gap-2 items-center">
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <span className="text-xs text-slate-650 font-semibold">
            {visit.therapist?.name || "—"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded border ${visit.status === "Completed"
            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
            : visit.status === "Cancelled"
              ? "bg-rose-50 text-rose-600 border-rose-200"
              : "bg-indigo-50 text-indigo-600 border-indigo-200"
            }`}>
            {visit.status || "Scheduled"}
          </span>

          <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded border ${visit.paymentStatus === "Paid"
            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
            : "bg-rose-50 text-rose-600 border-rose-200"
            }`}>
            {visit.paymentStatus || "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClinicTodayVisits;
