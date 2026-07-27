import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClinicSkeleton from "../../components/ClinicSkeleton/ClinicSkeleton";
import { useBranding } from "../../context/BrandingContext";
import { useClinic } from "../../context/ClinicContext";
import ClinicPagination from "../../features/clinic/components/ClinicPagination";
import PatientCard from "../../features/clinic/components/PatientCard";
import PatientFormModal from "../../features/clinic/components/PatientFormModal";
import useClinicPagination from "../../features/clinic/hooks/useClinicPagination";
import usePatientForm from "../../features/clinic/hooks/usePatientForm";
import toast from "react-hot-toast";
import CustomConfirmModal from "../../components/CustomConfirmModal/CustomConfirmModal";
import { generateClinicPatientId } from "../../features/clinic/utils/clinicFormatters";

const PATIENTS_PER_PAGE = 15;

const ClinicPatients = () => {
  const navigate = useNavigate();
  const { settings } = useBranding();
  const { patients, loadingPatients, fetchPatients, addPatient, deletePatient } = useClinic();
  const [saving, setSaving] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const triggerDeletePatient = (patientId) => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Delete Patient",
      message: "Are you sure you want to permanently delete this patient record? All linked cases, visits, and documents will be deleted. This action cannot be undone.",
      onConfirm: () => handleConfirmDeletePatient(patientId),
    });
  };

  const handleConfirmDeletePatient = async (patientId) => {
    try {
      setSaving(true);
      await deletePatient(patientId);
      setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPatientCode = useCallback(
    (patientId) => generateClinicPatientId(patientId, settings?.name),
    [settings?.name]
  );

  const filteredPatients = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return patients
      .filter((patient) => (
        patient.name.toLowerCase().includes(query) ||
        patient.phone.includes(query) ||
        getPatientCode(patient._id).includes(query)
      ))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [patients, searchQuery, getPatientCode]);

  const {
    currentPage,
    pageItems: displayedPatients,
    totalPages,
    handlePageChange,
  } = useClinicPagination(filteredPatients, PATIENTS_PER_PAGE, searchQuery);

  const patientForm = usePatientForm({
    addPatient,
    onSuccess: () => setIsModalOpen(false),
  });

  const openPatientModal = () => {
    patientForm.resetForm();
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full md:w-auto">
          <div className="relative flex-1 sm:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by name, phone, id..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full py-2.5 pl-10 pr-14 rounded-xl border border-slate-200/80 bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-xs font-medium transition-all shadow-sm"
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

          <button
            onClick={openPatientModal}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-2xl hover:bg-primary-hover shadow-md hover:shadow-lg transition-premium cursor-pointer shrink-0"
          >
            <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Patient
          </button>
        </div>
      </div>

      {loadingPatients ? (
        <ClinicSkeleton type="grid" count={6} />
      ) : displayedPatients.length === 0 ? (
        <div className="bg-white border border-slate-200/60 p-12 rounded-[32px] text-center max-w-xl mx-auto shadow-sm">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <h3 className="text-base font-bold text-secondary mb-1">No Patient Records</h3>
          <p className="text-xs text-slate-500 mb-6">
            {searchQuery ? "No patients match your search criteria." : "Get started by registering your first clinic patient."}
          </p>
          {!searchQuery && (
            <button
              onClick={openPatientModal}
              className="px-5 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-primary-hover shadow transition-all duration-200 cursor-pointer"
            >
              Register Patient
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedPatients.map((patient) => (
              <PatientCard
                key={patient._id}
                patient={patient}
                patientCode={getPatientCode(patient._id)}
                onClick={() => navigate(`/clinic/patients/${patient._id}`)}
                onDelete={triggerDeletePatient}
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

      <PatientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Patient"
        form={patientForm}
      />

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

export default ClinicPatients;
