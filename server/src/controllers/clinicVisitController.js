import { ClinicVisit } from "../models/clinicVisit.js";
import { ClinicCase } from "../models/clinicCase.js";
import { User } from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

// @desc    Create a new clinic visit
// @route   POST /api/clinic/visits
// @access  Private/Admin
export const createVisit = asyncHandler(async (req, res) => {
  const {
    clinicCase,
    visitDate,
    visitTime,
    therapist,
    location,
    duration,
    paymentAmount,
    paymentStatus,
  } = req.body;

  // 1. Verify associated case exists
  const existingCase = await ClinicCase.findById(clinicCase);
  if (!existingCase) {
    throw new ApiError(404, "Associated clinic case not found");
  }

  // 2. Verify therapist user exists and has admin role if provided
  if (therapist) {
    const doctor = await User.findById(therapist);
    if (!doctor) {
      throw new ApiError(404, "Therapist user not found");
    }
    const allowedRoles = ["admin", "intern", "physiotherapist"];
    if (!allowedRoles.includes(doctor.role)) {
      throw new ApiError(400, "Therapist must be an admin, intern, or physiotherapist");
    }
  }

  const visit = await ClinicVisit.create({
    clinicCase,
    visitDate,
    visitTime,
    therapist,
    location,
    duration,
    paymentAmount,
    paymentStatus,
    status: "Scheduled", // defaulted on creation
  });

  return res.status(201).json({
    message: "Clinic visit created successfully",
    visit,
  });
});

// @desc    Get all clinic visits (with optional filter by clinicCase ID)
// @route   GET /api/clinic/visits
// @access  Private/Admin
export const getVisits = asyncHandler(async (req, res) => {
  const { clinicCase } = req.query;

  let query = {};
  if (clinicCase !== undefined) {
    if (clinicCase === "null" || clinicCase === "none" || clinicCase === "") {
      query.clinicCase = null;
    } else {
      query.clinicCase = clinicCase;
    }
  }

  const visits = await ClinicVisit.find(query)
    .populate({
      path: "clinicCase",
      select: "title patient",
      populate: {
        path: "patient",
        select: "name phone gender",
      },
    })
    .populate("therapist", "name")
    .sort({ visitDate: -1, createdAt: -1 });

  return res.status(200).json(visits);
});

// @desc    Get single clinic visit by ID
// @route   GET /api/clinic/visits/:id
// @access  Private/Admin
export const getVisitById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const visit = await ClinicVisit.findById(id)
    .populate({
      path: "clinicCase",
      select: "title patient",
      populate: {
        path: "patient",
        select: "name phone gender",
      },
    })
    .populate("therapist", "name");

  if (!visit) {
    throw new ApiError(404, "Clinic visit not found");
  }

  return res.status(200).json(visit);
});

// @desc    Update a clinic visit (can change status to Completed or Cancelled)
// @route   PUT /api/clinic/visits/:id
// @access  Private/Admin
export const updateVisit = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    clinicCase,
    visitDate,
    visitTime,
    therapist,
    location,
    duration,
    paymentAmount,
    paymentStatus,
    status,
  } = req.body;

  const visit = await ClinicVisit.findById(id);
  if (!visit) {
    throw new ApiError(404, "Clinic visit not found");
  }

  // 1. Verify case if updated
  if (clinicCase !== undefined && clinicCase !== visit.clinicCase.toString()) {
    const existingCase = await ClinicCase.findById(clinicCase);
    if (!existingCase) {
      throw new ApiError(404, "Associated clinic case not found");
    }
    visit.clinicCase = clinicCase;
  }

  // 2. Verify therapist if updated
  if (therapist !== undefined) {
    if (therapist === null || therapist === "") {
      visit.therapist = undefined;
    } else if (therapist !== (visit.therapist ? visit.therapist.toString() : "")) {
      const doctor = await User.findById(therapist);
      if (!doctor) {
        throw new ApiError(404, "Therapist user not found");
      }
      const allowedRoles = ["admin", "intern", "physiotherapist"];
      if (!allowedRoles.includes(doctor.role)) {
        throw new ApiError(400, "Therapist must be an admin, intern, or physiotherapist");
      }
      visit.therapist = therapist;
    }
  }

  if (visitDate !== undefined) visit.visitDate = visitDate;
  if (visitTime !== undefined) visit.visitTime = visitTime;
  if (location !== undefined) visit.location = location;
  if (duration !== undefined) visit.duration = duration;
  if (paymentAmount !== undefined || paymentStatus !== undefined) {
    if (req.user.role !== "admin") {
      const hasPaymentPermission = req.user.permissions && req.user.permissions.includes("payments:manage");
      if (!hasPaymentPermission) {
        throw new ApiError(403, "You do not have permission to manage payment details.");
      }
    }
    if (paymentAmount !== undefined) visit.paymentAmount = paymentAmount;
    if (paymentStatus !== undefined) visit.paymentStatus = paymentStatus;
  }
  if (status !== undefined) visit.status = status;

  const updatedVisit = await visit.save();

  return res.status(200).json({
    message: "Clinic visit updated successfully",
    visit: updatedVisit,
  });
});

// @desc    Delete a clinic visit
// @route   DELETE /api/clinic/visits/:id
// @access  Private/Admin
export const deleteVisit = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const visit = await ClinicVisit.findById(id);
  if (!visit) {
    throw new ApiError(404, "Clinic visit not found");
  }

  await visit.deleteOne();

  return res.status(200).json({
    message: "Clinic visit deleted successfully",
  });
});
