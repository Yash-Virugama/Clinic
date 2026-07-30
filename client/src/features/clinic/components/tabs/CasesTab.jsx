import React from "react";
import CaseListCard from "../CaseListCard";
import { Icon, EmptyState } from "./TabHelpers";

const CasesTab = ({
  triggerCreateCase,
  saving,
  cases,
  visits,
  records,
  files,
  triggerEditCase,
  handleUpdateCaseStatus,
  triggerDeleteCase
}) => {
  return (
    <div className="space-y-5">
      <button 
        onClick={triggerCreateCase} 
        disabled={saving} 
        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-primary-hover disabled:opacity-60 cursor-pointer"
      >
        <Icon name="plus" className="w-4.5 h-4.5" />
        Open New Case
      </button>
      {cases.length === 0 ? (
        <EmptyState icon="folder" title="No cases opened yet." subtitle='Click "Open New Case" to create the first case.' />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {cases.map((clinicCase, index) => (
            <CaseListCard
              key={clinicCase._id}
              clinicCase={clinicCase}
              index={index + 1}
              visits={visits.filter((visit) => (visit.clinicCase?._id || visit.clinicCase) === clinicCase._id)}
              records={records.filter((record) => (record.clinicCase?._id || record.clinicCase) === clinicCase._id)}
              files={files.filter((file) => (file.clinicCase?._id || file.clinicCase) === clinicCase._id)}
              onEdit={triggerEditCase}
              onUpdateStatus={(newStatus) => handleUpdateCaseStatus(clinicCase._id, newStatus)}
              onDelete={() => triggerDeleteCase(clinicCase._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CasesTab;
