import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import ClinicSkeleton from "../components/ClinicSkeleton";
import { useBranding } from "../../../context/BrandingContext";
import useClinicPatientWorkspace from "../hooks/useClinicPatientWorkspace";

// Import modular child components
import PatientProfileCard from "../components/PatientProfileCard";
import PatientFormModal from "../components/PatientFormModal";
import AddNoteModal from "../components/AddNoteModal";
import CustomConfirmModal from "../../../components/ui/CustomConfirmModal";
import CaseFormModal from "../components/CaseFormModal";
import ClinicalRecordFormModal from "../components/ClinicalRecordFormModal";
import DocFormModal from "../components/DocFormModal";
import VisitFormModal from "../components/VisitFormModal";

// Tabs
import OverviewTab from "../components/tabs/OverviewTab";
import CasesTab from "../components/tabs/CasesTab";
import ClinicalTab from "../components/tabs/ClinicalTab";
import DocsTab from "../components/tabs/DocsTab";
import VisitsTab from "../components/tabs/VisitsTab";
import { Icon } from "../components/tabs/TabHelpers";
import { formatDateDDMMYYYY } from "../utils/clinicFormatters";

const tabs = [
  { key: "overview", label: "Overview", icon: "info" },
  { key: "cases", label: "Cases", icon: "folder" },
  { key: "clinical", label: "Clinical", icon: "clipboard" },
  { key: "docs", label: "Docs", icon: "file" },
  { key: "visits", label: "Visits", icon: "clock" },
];

const ClinicPatientDetails = () => {
  const { user } = useAuth();
  const clinicPrefix = user?.role === "admin" ? "/clinic" : `/staff/${user?.role}/clinic`;
  const { settings } = useBranding();
  const workspace = useClinicPatientWorkspace();

  const {
    activeTab,
    setActiveTab,
    patient,
    cases,
    records,
    files,
    visits,
    selectedCaseId,
    setSelectedCaseId,
    loading,
    saving,
    isAddNoteOpen,
    setIsAddNoteOpen,
    confirmModalConfig,
    setConfirmModalConfig,
    isDocModalOpen,
    setIsDocModalOpen,
    isEditDoc,
    selectedDocData,
    isCaseModalOpen,
    setIsCaseModalOpen,
    isEditCase,
    selectedCaseData,
    isRecordModalOpen,
    setIsRecordModalOpen,
    isEditRecord,
    selectedRecordData,
    isVisitModalOpen,
    setIsVisitModalOpen,
    isEditVisit,
    selectedVisitData,
    expandedVisitId,
    setExpandedVisitId,
    expandedRecordId,
    setExpandedRecordId,
    expandedDocId,
    setExpandedDocId,
    doctors,
    isEditPatientOpen,
    setIsEditPatientOpen,
    editPatientForm,
    selectedCase,
    overviewCase,
    patientCode,
    scopedRecords,
    scopedFiles,
    visitsCaseId,
    scopedVisits,
    triggerEditPatient,
    triggerCreateCase,
    triggerEditCase,
    handleCaseFormSubmit,
    handleUpdateCaseStatus,
    triggerDeleteCase,
    triggerCreateRecord,
    triggerEditRecord,
    handleRecordFormSubmit,
    triggerDeleteRecord,
    triggerDeleteVisit,
    logVisit,
    editVisit,
    handleVisitFormSubmit,
    handleUpdateVisitStatus,
    triggerUploadDoc,
    triggerEditDoc,
    triggerDeleteDoc,
    handleDocFormSubmit,
    handleCreateNoteSubmit,
    deleteInternalNote
  } = workspace;

  if (loading) return <ClinicSkeleton type="details" />;

  if (!patient) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-secondary mb-2">Patient Not Found</h3>
        <p className="text-sm text-slate-500 mb-6">The patient record you are looking for does not exist or has been deleted.</p>
        <Link to={`${clinicPrefix}/patients`} className="px-6 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-primary-hover shadow inline-block">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-page-entrance">
      {/* Top Header bar */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-semidarkblue">Patient Profile</h1>
        <Link to={`${clinicPrefix}/patients`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-650 text-xs font-bold uppercase tracking-wider shadow-sm hover:border-primary hover:text-primary transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      {/* Two-Column Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Left Column: Basic Details Card */}
        <div className="lg:col-span-1">
          <PatientProfileCard
            patient={patient}
            patientCode={patientCode}
            settings={settings}
            selectedCase={selectedCase}
            onEdit={triggerEditPatient}
            isActive={cases.some((c) => c.status === "Active")}
          />
        </div>

        {/* Right Column: Tab System and Details */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-slate-200/50 rounded-[28px] shadow-sm">
            {/* Tab navigation */}
            <div className="grid grid-cols-5 border-b px-2 border-slate-150 overflow-x-auto bg-slate-50/30 rounded-t-[28px]">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`min-w-[50px] flex flex-col items-center justify-center gap-1 py-3 border-b-2.5 transition-colors cursor-pointer ${isActive ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-secondary"
                      }`}
                  >
                    <Icon name={tab.icon} className="w-5 h-5" />
                    <span className="text-[11px] font-bold tracking-wide">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab contents */}
            <div className="px-3.5 py-6 sm:p-7">
              {activeTab === "overview" && (
                <OverviewTab
                  overviewCase={overviewCase}
                  cases={cases}
                  visits={visits}
                  records={records}
                  files={files}
                  setActiveTab={setActiveTab}
                  formatDate={formatDateDDMMYYYY}
                  patient={patient}
                  setIsAddNoteOpen={setIsAddNoteOpen}
                  deleteInternalNote={deleteInternalNote}
                  saving={saving}
                />
              )}

              {activeTab === "cases" && (
                <CasesTab
                  triggerCreateCase={triggerCreateCase}
                  saving={saving}
                  cases={cases}
                  visits={visits}
                  records={records}
                  files={files}
                  triggerEditCase={triggerEditCase}
                  handleUpdateCaseStatus={handleUpdateCaseStatus}
                  triggerDeleteCase={triggerDeleteCase}
                />
              )}

              {activeTab === "clinical" && (
                <ClinicalTab
                  cases={cases}
                  selectedCaseId={selectedCaseId}
                  setSelectedCaseId={setSelectedCaseId}
                  triggerCreateRecord={triggerCreateRecord}
                  saving={saving}
                  scopedRecords={scopedRecords}
                  expandedRecordId={expandedRecordId}
                  setExpandedRecordId={setExpandedRecordId}
                  triggerEditRecord={triggerEditRecord}
                  triggerDeleteRecord={triggerDeleteRecord}
                />
              )}

              {activeTab === "docs" && (
                <DocsTab
                  cases={cases}
                  selectedCaseId={selectedCaseId}
                  setSelectedCaseId={setSelectedCaseId}
                  triggerUploadDoc={triggerUploadDoc}
                  saving={saving}
                  scopedFiles={scopedFiles}
                  expandedDocId={expandedDocId}
                  setExpandedDocId={setExpandedDocId}
                  triggerEditDoc={triggerEditDoc}
                  triggerDeleteDoc={triggerDeleteDoc}
                />
              )}

              {activeTab === "visits" && (
                <VisitsTab
                  cases={cases}
                  visitsCaseId={visitsCaseId}
                  setSelectedCaseId={setSelectedCaseId}
                  logVisit={logVisit}
                  saving={saving}
                  scopedVisits={scopedVisits}
                  expandedVisitId={expandedVisitId}
                  setExpandedVisitId={setExpandedVisitId}
                  editVisit={editVisit}
                  handleUpdateVisitStatus={handleUpdateVisitStatus}
                  triggerDeleteVisit={triggerDeleteVisit}
                />
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={isAddNoteOpen}
        onClose={() => setIsAddNoteOpen(false)}
        onSubmit={handleCreateNoteSubmit}
        submitting={saving}
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

      {/* Case Creation/Edit Form Modal */}
      <CaseFormModal
        isOpen={isCaseModalOpen}
        onClose={() => {
          setIsCaseModalOpen(false);
        }}
        onSubmit={handleCaseFormSubmit}
        isEdit={isEditCase}
        caseData={selectedCaseData}
        doctors={doctors}
        submitting={saving}
      />

      {/* Clinical Record Creation/Edit Form Modal */}
      <ClinicalRecordFormModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
        }}
        onSubmit={handleRecordFormSubmit}
        onDelete={selectedRecordData ? () => triggerDeleteRecord(selectedRecordData._id) : null}
        isEdit={isEditRecord}
        recordData={selectedRecordData}
        cases={cases}
        selectedCaseId={selectedCaseId}
        submitting={saving}
      />

      {/* Document Upload/Edit Form Modal */}
      <DocFormModal
        isOpen={isDocModalOpen}
        onClose={() => {
          setIsDocModalOpen(false);
        }}
        onSubmit={handleDocFormSubmit}
        isEdit={isEditDoc}
        fileData={selectedDocData}
        cases={cases}
        selectedCaseId={selectedCaseId}
        submitting={saving}
      />

      {/* Visit Creation/Edit Form Modal */}
      <VisitFormModal
        isOpen={isVisitModalOpen}
        onClose={() => {
          setIsVisitModalOpen(false);
        }}
        onSubmit={handleVisitFormSubmit}
        isEdit={isEditVisit}
        visitData={selectedVisitData}
        cases={cases}
        selectedCaseId={selectedCaseId}
        doctors={doctors}
        submitting={saving}
      />

      {/* Patient Edit Form Modal */}
      <PatientFormModal
        isOpen={isEditPatientOpen}
        onClose={() => setIsEditPatientOpen(false)}
        title="Edit Patient Details"
        form={editPatientForm}
        submitLabel="Save Changes"
        submittingLabel="Saving..."
      />
    </div>
  );
};

export default ClinicPatientDetails;
