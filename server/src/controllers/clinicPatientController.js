import { ClinicPatient } from "../models/clinicPatient.js";
import { ClinicCase } from "../models/clinicCase.js";
import { ClinicVisit } from "../models/clinicVisit.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

// @desc    Create a new clinic patient
// @route   POST /api/clinic/patients
// @access  Private/Admin
export const createPatient = asyncHandler(async (req, res) => {
  const { name, gender, phone } = req.body;

  // Optional: check if a patient with the same name and phone already exists to prevent duplicate entry
  const existingPatient = await ClinicPatient.findOne({ name, phone });
  if (existingPatient) {
    throw new ApiError(409, "A patient with this name and phone number already exists");
  }

  const patient = await ClinicPatient.create({
    name,
    gender,
    phone,
  });

  return res.status(201).json({
    message: "Patient registered successfully",
    patient,
  });
});

// @desc    Get all clinic patients (with optional search by name or phone)
// @route   GET /api/clinic/patients
// @access  Private/Admin
export const getPatients = asyncHandler(async (req, res) => {
  const { search } = req.query;
  
  let query = {};
  if (search) {
    const cleanSearch = search.trim();
    query = {
      $or: [
        { name: { $regex: cleanSearch, $options: "i" } },
        { phone: { $regex: cleanSearch, $options: "i" } },
      ],
    };
  }

  const patients = await ClinicPatient.find(query).sort({ createdAt: -1 });

  // Determine active cases for all patients
  const activeCases = await ClinicCase.find({ status: "Active" });
  const activePatientIds = new Set(activeCases.map((c) => c.patient.toString()));

  // Determine total payments for all patients
  const allVisits = await ClinicVisit.find({}).populate("clinicCase");
  const paymentsMap = {};
  allVisits.forEach((visit) => {
    if (!visit.clinicCase || !visit.clinicCase.patient) return;
    const pId = visit.clinicCase.patient.toString();
    if (!paymentsMap[pId]) {
      paymentsMap[pId] = { totalPaid: 0, totalUnpaid: 0 };
    }
    const amt = visit.paymentAmount || 0;
    if (visit.paymentStatus === "Paid") {
      paymentsMap[pId].totalPaid += amt;
    } else {
      paymentsMap[pId].totalUnpaid += amt;
    }
  });

  const patientsWithStatus = patients.map((patient) => {
    const pObj = patient.toObject();
    const pId = patient._id.toString();
    pObj.isActive = activePatientIds.has(pId);
    pObj.totalPaid = paymentsMap[pId]?.totalPaid || 0;
    pObj.totalUnpaid = paymentsMap[pId]?.totalUnpaid || 0;
    return pObj;
  });

  return res.status(200).json(patientsWithStatus);
});

// @desc    Get single clinic patient by ID
// @route   GET /api/clinic/patients/:id
// @access  Private/Admin
export const getPatientById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const patient = await ClinicPatient.findById(id);
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  return res.status(200).json(patient);
});

// @desc    Update a clinic patient
// @route   PUT /api/clinic/patients/:id
// @access  Private/Admin
export const updatePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, gender, phone } = req.body;

  const patient = await ClinicPatient.findById(id);
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  if (name !== undefined) patient.name = name;
  if (gender !== undefined) patient.gender = gender;
  if (phone !== undefined) patient.phone = phone;

  const updatedPatient = await patient.save();

  return res.status(200).json({
    message: "Patient details updated successfully",
    patient: updatedPatient,
  });
});

// @desc    Delete a clinic patient
// @route   DELETE /api/clinic/patients/:id
// @access  Private/Admin
export const deletePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const patient = await ClinicPatient.findById(id);
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  await patient.deleteOne();

  return res.status(200).json({
    message: "Patient record deleted successfully",
  });
});

// @desc    Add a note to a clinic patient
// @route   POST /api/clinic/patients/:id/notes
// @access  Private/Admin
export const addPatientNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { noteType, note } = req.body;

  const patient = await ClinicPatient.findById(id);
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  patient.notes.push({
    noteType,
    note,
  });

  await patient.save();

  const addedNote = patient.notes[patient.notes.length - 1];

  return res.status(201).json({
    message: "Note added successfully",
    note: addedNote,
  });
});

// @desc    Delete a note from a clinic patient
// @route   DELETE /api/clinic/patients/:id/notes/:noteId
// @access  Private/Admin
export const deletePatientNote = asyncHandler(async (req, res) => {
  const { id, noteId } = req.params;

  const patient = await ClinicPatient.findById(id);
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  const noteIndex = patient.notes.findIndex((n) => n._id.toString() === noteId);
  if (noteIndex === -1) {
    throw new ApiError(404, "Note not found");
  }

  patient.notes.splice(noteIndex, 1);

  await patient.save();

  return res.status(200).json({
    message: "Note deleted successfully",
  });
});
