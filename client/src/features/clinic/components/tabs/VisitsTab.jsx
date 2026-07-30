import React from "react";
import VisitCard from "../VisitCard";
import { SectionToolbar, EmptyState } from "./TabHelpers";

const VisitsTab = ({
  cases,
  visitsCaseId,
  setSelectedCaseId,
  logVisit,
  saving,
  scopedVisits,
  expandedVisitId,
  setExpandedVisitId,
  editVisit,
  handleUpdateVisitStatus,
  triggerDeleteVisit
}) => {
  return (
    <div className="space-y-5">
      <SectionToolbar
        cases={cases}
        selectedCaseId={visitsCaseId}
        setSelectedCaseId={setSelectedCaseId}
        buttonLabel="Log Visit"
        buttonIcon="plus"
        onAction={logVisit}
        disabled={!visitsCaseId || saving}
        excludeGeneral={true}
      />
      {scopedVisits.length === 0 ? (
        <EmptyState icon="clock" title="No visits logged yet." subtitle='Click "Log Visit" to add the first visit.' />
      ) : (
        <div className="space-y-3">
          {scopedVisits.map((visit, index) => (
            <VisitCard
              key={visit._id}
              visit={visit}
              index={index + 1}
              cases={cases}
              expanded={expandedVisitId === visit._id}
              onToggleExpand={() =>
                setExpandedVisitId((curr) => (curr === visit._id ? null : visit._id))
              }
              onEdit={() => editVisit(visit)}
              onUpdateStatus={(newStatus) => handleUpdateVisitStatus(visit._id, newStatus)}
              onDelete={() => triggerDeleteVisit(visit._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VisitsTab;
