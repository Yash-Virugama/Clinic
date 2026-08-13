import { ClinicCase } from "../models/clinicCase.js";
import { ClinicPatient } from "../models/clinicPatient.js";
import { ClinicVisit } from "../models/clinicVisit.js";
import { User } from "../models/user.js";
import { Setting } from "../models/setting.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

// @desc    Create a new clinic case
// @route   POST /api/clinic/cases
// @access  Private/Admin
export const createCase = asyncHandler(async (req, res) => {
  const { patient, title, consultingDoctor, status } = req.body;

  // 1. Verify patient exists
  const existingPatient = await ClinicPatient.findById(patient);
  if (!existingPatient) {
    throw new ApiError(404, "Patient not found");
  }

  // 2. Verify consulting doctor exists and is an admin
  const doctor = await User.findById(consultingDoctor);
  if (!doctor) {
    throw new ApiError(404, "Consulting doctor user not found");
  }
  const allowedRoles = ["admin", "intern", "physiotherapist"];
  if (!allowedRoles.includes(doctor.role)) {
    throw new ApiError(400, "Consulting doctor must be an admin, intern, or physiotherapist");
  }

  const newCase = await ClinicCase.create({
    patient,
    title,
    consultingDoctor,
    status: status || "Active",
  });

  return res.status(201).json({
    message: "Clinic case created successfully",
    case: newCase,
  });
});

// @desc    Get all clinic cases (with optional filter by patient ID or status)
// @route   GET /api/clinic/cases
// @access  Private/Admin
export const getCases = asyncHandler(async (req, res) => {
  const { patient, status } = req.query;

  let query = {};
  if (patient) {
    query.patient = patient;
  }
  if (status) {
    query.status = status;
  }

  const cases = await ClinicCase.find(query)
    .populate("patient", "name phone")
    .populate("consultingDoctor", "name")
    .sort({ createdAt: -1 });

  return res.status(200).json(cases);
});

// @desc    Get single clinic case by ID
// @route   GET /api/clinic/cases/:id
// @access  Private/Admin
export const getCaseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const clinicCase = await ClinicCase.findById(id)
    .populate("patient", "name phone")
    .populate("consultingDoctor", "name");

  if (!clinicCase) {
    throw new ApiError(404, "Clinic case not found");
  }

  return res.status(200).json(clinicCase);
});

// @desc    Update a clinic case
// @route   PUT /api/clinic/cases/:id
// @access  Private/Admin
export const updateCase = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { patient, title, consultingDoctor, status } = req.body;

  const clinicCase = await ClinicCase.findById(id);
  if (!clinicCase) {
    throw new ApiError(404, "Clinic case not found");
  }

  // 1. Verify patient if updating patient field
  if (patient !== undefined && patient !== clinicCase.patient.toString()) {
    const existingPatient = await ClinicPatient.findById(patient);
    if (!existingPatient) {
      throw new ApiError(404, "Patient not found");
    }
    clinicCase.patient = patient;
  }

  // 2. Verify consulting doctor if updating doctor field
  if (consultingDoctor !== undefined && consultingDoctor !== clinicCase.consultingDoctor.toString()) {
    const doctor = await User.findById(consultingDoctor);
    if (!doctor) {
      throw new ApiError(404, "Consulting doctor user not found");
    }
    const allowedRoles = ["admin", "intern", "physiotherapist"];
    if (!allowedRoles.includes(doctor.role)) {
      throw new ApiError(400, "Consulting doctor must be an admin, intern, or physiotherapist");
    }
    clinicCase.consultingDoctor = consultingDoctor;
  }

  if (title !== undefined) clinicCase.title = title;
  if (status !== undefined) clinicCase.status = status;

  const updatedCase = await clinicCase.save();

  return res.status(200).json({
    message: "Clinic case updated successfully",
    case: updatedCase,
  });
});

// @desc    Delete a clinic case
// @route   DELETE /api/clinic/cases/:id
// @access  Private/Admin
export const deleteCase = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const clinicCase = await ClinicCase.findById(id);
  if (!clinicCase) {
    throw new ApiError(404, "Clinic case not found");
  }

  await clinicCase.deleteOne();

  return res.status(200).json({
    message: "Clinic case deleted successfully",
  });
});

// @desc    Bulk update all visit payments for a clinic case
// @route   PUT /api/clinic/cases/:id/payments
// @access  Private/Admin
export const updateCasePayments = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { paymentStatus, paymentAmount } = req.body;

  const clinicCase = await ClinicCase.findById(id);
  if (!clinicCase) {
    throw new ApiError(404, "Clinic case not found");
  }

  // Find all visits under this case
  const visits = await ClinicVisit.find({ clinicCase: id });
  if (visits.length === 0) {
    return res.status(200).json({
      message: "No visits found for this case to update",
      updatedCount: 0,
    });
  }

  // Update each visit
  const bulkUpdates = visits.map((visit) => {
    if (paymentStatus !== undefined) {
      visit.paymentStatus = paymentStatus;
    }
    if (paymentAmount !== undefined) {
      visit.paymentAmount = paymentAmount;
    }
    return visit.save();
  });

  await Promise.all(bulkUpdates);

  return res.status(200).json({
    message: `Successfully updated payments for ${visits.length} sessions under this case.`,
    updatedCount: visits.length,
  });
});

// @desc    Get public invoice details for a clinic case
// @route   GET /api/clinic/cases/public/invoice/:id
// @access  Public
export const getPublicInvoiceData = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const clinicCase = await ClinicCase.findById(id)
    .populate("patient")
    .populate("consultingDoctor", "name");

  if (!clinicCase) {
    throw new ApiError(404, "Clinic case not found");
  }

  const patient = clinicCase.patient;
  if (!patient) {
    throw new ApiError(404, "Patient not found associated with this case");
  }

  // Fetch all visits for this case
  const visits = await ClinicVisit.find({ clinicCase: id })
    .populate("therapist", "name")
    .sort({ date: 1, time: 1 });

  // Fetch settings
  const settings = await Setting.findOne() || {};

  return res.status(200).json({
    patient,
    clinicCase,
    visits,
    settings,
  });
});
