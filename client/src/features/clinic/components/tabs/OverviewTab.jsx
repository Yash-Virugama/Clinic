import React from "react";
import CaseSummaryCard from "../CaseSummaryCard";
import InternalNotesCard from "../InternalNotesCard";
import { EmptyState } from "./TabHelpers";

const OverviewTab = ({
  overviewCase,
  cases,
  visits,
  records,
  files,
  setActiveTab,
  formatDate,
  patient,
  setIsAddNoteOpen,
  deleteInternalNote,
  saving
}) => {
  return (
    <div className="space-y-6">
      {/* Active Case Card */}
      {overviewCase ? (
        <CaseSummaryCard
          selectedCase={overviewCase}
          caseIndex={cases.findIndex((item) => item._id === overviewCase._id) + 1}
          visitsCount={visits.filter((v) => (v.clinicCase?._id || v.clinicCase) === overviewCase._id).length}
          recordsCount={records.filter((r) => (r.clinicCase?._id || r.clinicCase) === overviewCase._id).length}
          filesCount={files.filter((f) => (f.clinicCase?._id || f.clinicCase) === overviewCase._id).length}
          onNavigateToTabs={() => setActiveTab("cases")}
          formatDate={formatDate}
        />
      ) : (
        <EmptyState icon="folder" title="No active case yet." subtitle='Click "Open New Case" to create the first one.' />
      )}

      {/* Internal Notes Card */}
      <InternalNotesCard
        notes={patient.notes || []}
        onAddClick={() => setIsAddNoteOpen(true)}
        onDelete={deleteInternalNote}
        saving={saving}
        formatDate={formatDate}
      />
    </div>
  );
};

export default OverviewTab;
