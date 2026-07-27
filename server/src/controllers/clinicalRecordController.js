import { ClinicalRecord } from "../models/clinicalRecord.js";
import { ClinicCase } from "../models/clinicCase.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

// @desc    Create a new clinical record
// @route   POST /api/clinic/records
// @access  Private/Admin
export const createRecord = asyncHandler(async (req, res) => {
  const {
    chiefComplaint,
    diagnosis,
    clinicCase,
    treatmentPlan,
    alertsAndPrecautions,
    patient,
  } = req.body;

  // Resolve case ID and auto-fill patient ID if case exists
  let caseId = null;
  let patientId = patient || null;
  if (
    clinicCase &&
    clinicCase !== "" &&
    clinicCase !== "null" &&
    clinicCase !== "no specific case"
  ) {
    const existingCase = await ClinicCase.findById(clinicCase);
    if (!existingCase) {
      throw new ApiError(404, "Associated clinic case not found");
    }
    caseId = clinicCase;
    if (!patientId) {
      patientId = existingCase.patient;
    }
  }

  const record = await ClinicalRecord.create({
    chiefComplaint,
    diagnosis,
    clinicCase: caseId,
    patient: patientId,
    treatmentPlan,
    alertsAndPrecautions,
  });

  return res.status(201).json({
    message: "Clinical record created successfully",
    record,
  });
});

// @desc    Get all clinical records (with optional filter by clinicCase ID)
// @route   GET /api/clinic/records
// @access  Private/Admin
export const getRecords = asyncHandler(async (req, res) => {
  const { clinicCase, patient } = req.query;

  let query = {};
  if (clinicCase !== undefined) {
    if (
      clinicCase === "null" ||
      clinicCase === "none" ||
      clinicCase === "no specific case" ||
      clinicCase === ""
    ) {
      query.clinicCase = null;
    } else {
      query.clinicCase = clinicCase;
    }
  }
  if (patient) {
    query.patient = patient;
  }

  const records = await ClinicalRecord.find(query)
    .populate({
      path: "clinicCase",
      select: "title patient",
      populate: {
        path: "patient",
        select: "name phone",
      },
    })
    .sort({ createdAt: -1 });

  return res.status(200).json(records);
});

// @desc    Get single clinical record by ID
// @route   GET /api/clinic/records/:id
// @access  Private/Admin
export const getRecordById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const record = await ClinicalRecord.findById(id).populate({
    path: "clinicCase",
    select: "title patient",
    populate: {
      path: "patient",
      select: "name phone",
    },
  });

  if (!record) {
    throw new ApiError(404, "Clinical record not found");
  }

  return res.status(200).json(record);
});

// @desc    Update a clinical record
// @route   PUT /api/clinic/records/:id
// @access  Private/Admin
export const updateRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    chiefComplaint,
    diagnosis,
    clinicCase,
    treatmentPlan,
    alertsAndPrecautions,
    patient,
  } = req.body;

  const record = await ClinicalRecord.findById(id);
  if (!record) {
    throw new ApiError(404, "Clinical record not found");
  }

  // Update case reference if changed
  if (clinicCase !== undefined) {
    if (
      clinicCase === null ||
      clinicCase === "" ||
      clinicCase === "null" ||
      clinicCase === "no specific case"
    ) {
      record.clinicCase = null;
    } else if (clinicCase !== (record.clinicCase ? record.clinicCase.toString() : "")) {
      const existingCase = await ClinicCase.findById(clinicCase);
      if (!existingCase) {
        throw new ApiError(404, "Associated clinic case not found");
      }
      record.clinicCase = clinicCase;
      if (!record.patient) {
        record.patient = existingCase.patient;
      }
    }
  }

  if (patient !== undefined) {
    record.patient = patient === "" ? null : patient;
  }

  if (chiefComplaint !== undefined) record.chiefComplaint = chiefComplaint;
  if (diagnosis !== undefined) record.diagnosis = diagnosis;
  if (treatmentPlan !== undefined) record.treatmentPlan = treatmentPlan;
  if (alertsAndPrecautions !== undefined) record.alertsAndPrecautions = alertsAndPrecautions;

  const updatedRecord = await record.save();

  return res.status(200).json({
    message: "Clinical record updated successfully",
    record: updatedRecord,
  });
});

// @desc    Delete a clinical record
// @route   DELETE /api/clinic/records/:id
// @access  Private/Admin
export const deleteRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const record = await ClinicalRecord.findById(id);
  if (!record) {
    throw new ApiError(404, "Clinical record not found");
  }

  await record.deleteOne();

  return res.status(200).json({
    message: "Clinical record deleted successfully",
  });
});
