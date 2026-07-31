import { ClinicAppointment } from "../models/clinicAppointment.js";
import { ClinicPatient } from "../models/clinicPatient.js";
import { ClinicCase } from "../models/clinicCase.js";
import { User } from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

// @desc    Create a new clinic appointment
// @route   POST /api/clinic/appointments
// @access  Private/Admin
export const createAppointment = asyncHandler(async (req, res) => {
  const {
    patient,
    therapist,
    date,
    time,
    duration,
    location,
    clinicCase,
    status,
    notes,
  } = req.body;

  // 1. Verify patient exists
  const existingPatient = await ClinicPatient.findById(patient);
  if (!existingPatient) {
    throw new ApiError(404, "Patient not found");
  }

  // 2. Verify therapist user exists and has admin role
  const doctor = await User.findById(therapist);
  if (!doctor) {
    throw new ApiError(404, "Therapist user not found");
  }
  const allowedRoles = ["admin", "intern", "physiotherapist"];
  if (!allowedRoles.includes(doctor.role)) {
    throw new ApiError(400, "Therapist must be an admin, intern, or physiotherapist");
  }

  // 3. Resolve and verify case ID
  let caseId = null;
  if (
    clinicCase &&
    clinicCase !== "" &&
    clinicCase !== "null" &&
    clinicCase !== "no case"
  ) {
    const existingCase = await ClinicCase.findById(clinicCase);
    if (!existingCase) {
      throw new ApiError(404, "Associated clinic case not found");
    }
    caseId = clinicCase;
  }

  const appointment = await ClinicAppointment.create({
    patient,
    therapist,
    date,
    time,
    duration,
    location,
    clinicCase: caseId,
    status: status || "scheduled",
    notes,
  });

  return res.status(201).json({
    message: "Clinic appointment created successfully",
    appointment,
  });
});

// @desc    Get all clinic appointments (with optional filters)
// @route   GET /api/clinic/appointments
// @access  Private/Admin
export const getAppointments = asyncHandler(async (req, res) => {
  const { patient, therapist, clinicCase, status } = req.query;

  let query = {};
  if (patient) {
    query.patient = patient;
  }
  if (therapist) {
    query.therapist = therapist;
  }
  if (status) {
    query.status = status;
  }
  
  if (clinicCase !== undefined) {
    if (
      clinicCase === "null" ||
      clinicCase === "none" ||
      clinicCase === "no case" ||
      clinicCase === ""
    ) {
      query.clinicCase = null;
    } else {
      query.clinicCase = clinicCase;
    }
  }

  const appointments = await ClinicAppointment.find(query)
    .populate("patient", "name phone")
    .populate("therapist", "name")
    .populate("clinicCase", "title")
    .sort({ date: -1, time: -1 });

  return res.status(200).json(appointments);
});

// @desc    Get single clinic appointment by ID
// @route   GET /api/clinic/appointments/:id
// @access  Private/Admin
export const getAppointmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const appointment = await ClinicAppointment.findById(id)
    .populate("patient", "name phone")
    .populate("therapist", "name")
    .populate("clinicCase", "title");

  if (!appointment) {
    throw new ApiError(404, "Clinic appointment not found");
  }

  return res.status(200).json(appointment);
});

// @desc    Update a clinic appointment details or status
// @route   PUT /api/clinic/appointments/:id
// @access  Private/Admin
export const updateAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    patient,
    therapist,
    date,
    time,
    duration,
    location,
    clinicCase,
    status,
    notes,
  } = req.body;

  const appointment = await ClinicAppointment.findById(id);
  if (!appointment) {
    throw new ApiError(404, "Clinic appointment not found");
  }

  // Verify patient if updated
  if (patient !== undefined && patient !== appointment.patient.toString()) {
    const existingPatient = await ClinicPatient.findById(patient);
    if (!existingPatient) {
      throw new ApiError(404, "Patient not found");
    }
    appointment.patient = patient;
  }

  // Verify therapist if updated
  if (therapist !== undefined && therapist !== appointment.therapist.toString()) {
    const doctor = await User.findById(therapist);
    if (!doctor) {
      throw new ApiError(404, "Therapist user not found");
    }
    const allowedRoles = ["admin", "intern", "physiotherapist"];
    if (!allowedRoles.includes(doctor.role)) {
      throw new ApiError(400, "Therapist must be an admin, intern, or physiotherapist");
    }
    appointment.therapist = therapist;
  }

  // Verify case if updated
  if (clinicCase !== undefined) {
    if (
      clinicCase === null ||
      clinicCase === "" ||
      clinicCase === "null" ||
      clinicCase === "no case"
    ) {
      appointment.clinicCase = null;
    } else if (clinicCase !== (appointment.clinicCase ? appointment.clinicCase.toString() : "")) {
      const existingCase = await ClinicCase.findById(clinicCase);
      if (!existingCase) {
        throw new ApiError(404, "Associated clinic case not found");
      }
      appointment.clinicCase = clinicCase;
    }
  }

  if (date !== undefined) appointment.date = date;
  if (time !== undefined) appointment.time = time;
  if (duration !== undefined) appointment.duration = duration;
  if (location !== undefined) appointment.location = location;
  if (status !== undefined) appointment.status = status;
  if (notes !== undefined) appointment.notes = notes;

  const updatedAppointment = await appointment.save();

  return res.status(200).json({
    message: "Clinic appointment updated successfully",
    appointment: updatedAppointment,
  });
});

// @desc    Delete a clinic appointment
// @route   DELETE /api/clinic/appointments/:id
// @access  Private/Admin
export const deleteAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const appointment = await ClinicAppointment.findById(id);
  if (!appointment) {
    throw new ApiError(404, "Clinic appointment not found");
  }

  await appointment.deleteOne();

  return res.status(200).json({
    message: "Clinic appointment deleted successfully",
  });
});
