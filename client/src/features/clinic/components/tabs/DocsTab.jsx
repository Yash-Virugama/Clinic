import React from "react";
import DocCard from "../DocCard";
import { SectionToolbar, EmptyState } from "./TabHelpers";

const DocsTab = ({
  cases,
  selectedCaseId,
  setSelectedCaseId,
  triggerUploadDoc,
  saving,
  scopedFiles,
  expandedDocId,
  setExpandedDocId,
  triggerEditDoc,
  triggerDeleteDoc
}) => {
  return (
    <div className="space-y-5">
      <SectionToolbar
        cases={cases}
        selectedCaseId={selectedCaseId}
        setSelectedCaseId={setSelectedCaseId}
        buttonLabel="Upload"
        buttonIcon="upload"
        onAction={triggerUploadDoc}
        disabled={cases.length === 0 || saving}
      />
      {scopedFiles.length === 0 ? (
        <EmptyState icon="folder" title="No documents uploaded yet." subtitle='Click "Upload" to add the first one.' />
      ) : (
        <div className="space-y-3">
          {scopedFiles.map((file, index) => (
            <DocCard
              key={file._id}
              file={file}
              index={index + 1}
              expanded={expandedDocId === file._id}
              onToggleExpand={() =>
                setExpandedDocId((curr) => (curr === file._id ? null : file._id))
              }
              onEdit={triggerEditDoc}
              onDelete={triggerDeleteDoc}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DocsTab;
