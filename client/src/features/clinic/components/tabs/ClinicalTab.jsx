import React from "react";
import ClinicalRecordCard from "../ClinicalRecordCard";
import { SectionToolbar, EmptyState } from "./TabHelpers";

const ClinicalTab = ({
  cases,
  selectedCaseId,
  setSelectedCaseId,
  triggerCreateRecord,
  saving,
  scopedRecords,
  expandedRecordId,
  setExpandedRecordId,
  triggerEditRecord,
  triggerDeleteRecord
}) => {
  return (
    <div className="space-y-5">
      <SectionToolbar
        cases={cases}
        selectedCaseId={selectedCaseId}
        setSelectedCaseId={setSelectedCaseId}
        buttonLabel="Add Record"
        buttonIcon="plus"
        onAction={triggerCreateRecord}
        disabled={cases.length === 0 || saving}
      />
      {scopedRecords.length === 0 ? (
        <EmptyState icon="clipboard" title="No clinical records yet." subtitle='Click "Add Record" to create the first one.' />
      ) : (
        <div className="space-y-3">
          {scopedRecords.map((record, index) => (
            <ClinicalRecordCard
              key={record._id}
              record={record}
              index={index + 1}
              expanded={expandedRecordId === record._id}
              onToggleExpand={() =>
                setExpandedRecordId((curr) => (curr === record._id ? null : record._id))
              }
              onEdit={triggerEditRecord}
              onDelete={triggerDeleteRecord}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClinicalTab;
