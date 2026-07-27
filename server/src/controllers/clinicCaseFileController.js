import path from "path";
import { ClinicCaseFile } from "../models/clinicCaseFile.js";
import { ClinicCase } from "../models/clinicCase.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

// @desc    Upload a new clinic case file
// @route   POST /api/clinic/files
// @access  Private/Admin
export const uploadCaseFile = asyncHandler(async (req, res) => {
  const { fileName, fileType, clinicCase, notes, patient } = req.body;

  // 1. Verify file exists in request
  if (!req.file) {
    throw new ApiError(400, "File is required");
  }

  // 2. Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5 MB
  if (req.file.size > maxSize) {
    throw new ApiError(400, "File size must not exceed 5MB");
  }

  // 3. Validate file extension
  const ext = path.extname(req.file.originalname).toLowerCase();
  const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];
  if (!allowedExtensions.includes(ext)) {
    throw new ApiError(
      400,
      "Invalid file format. Only PDF, JPG, PNG, DOC, and DOCX are allowed."
    );
  }

  // 4. Resolve and verify case ID
  let caseId = null;
  let patientId = patient || null;
  if (clinicCase && clinicCase !== "" && clinicCase !== "null") {
    const existingCase = await ClinicCase.findById(clinicCase);
    if (!existingCase) {
      throw new ApiError(404, "Associated clinic case not found");
    }
    caseId = clinicCase;
    if (!patientId) {
      patientId = existingCase.patient;
    }
  }

  // 5. Upload to Cloudinary (resource_type is "auto" to support PDF/images/DOC)
  const uploaded = await uploadToCloudinary(
    req.file.buffer,
    "physio-clinic/cases",
    "auto",
    req.file.originalname
  );

  const fileRecord = await ClinicCaseFile.create({
    fileUrl: uploaded.secure_url,
    fileName,
    fileType: fileType || "other",
    clinicCase: caseId,
    patient: patientId,
    notes,
  });

  return res.status(201).json({
    message: "File uploaded successfully",
    file: fileRecord,
  });
});

// @desc    Get all clinic case files (with optional filter by clinicCase ID)
// @route   GET /api/clinic/files
// @access  Private/Admin
export const getCaseFiles = asyncHandler(async (req, res) => {
  const { clinicCase, patient } = req.query;

  let query = {};
  if (clinicCase !== undefined) {
    if (clinicCase === "null" || clinicCase === "none" || clinicCase === "") {
      query.clinicCase = null;
    } else {
      query.clinicCase = clinicCase;
    }
  }
  if (patient) {
    query.patient = patient;
  }

  const files = await ClinicCaseFile.find(query)
    .populate({
      path: "clinicCase",
      select: "title patient",
      populate: {
        path: "patient",
        select: "name phone",
      },
    })
    .sort({ createdAt: -1 });

  return res.status(200).json(files);
});

// @desc    Get single clinic case file by ID
// @route   GET /api/clinic/files/:id
// @access  Private/Admin
export const getCaseFileById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const fileRecord = await ClinicCaseFile.findById(id).populate({
    path: "clinicCase",
    select: "title patient",
    populate: {
      path: "patient",
      select: "name phone",
    },
  });

  if (!fileRecord) {
    throw new ApiError(404, "Clinic case file not found");
  }

  return res.status(200).json(fileRecord);
});

// @desc    Update metadata of a clinic case file
// @route   PUT /api/clinic/files/:id
// @access  Private/Admin
export const updateCaseFile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fileName, fileType, clinicCase, notes, patient } = req.body;

  const fileRecord = await ClinicCaseFile.findById(id);
  if (!fileRecord) {
    throw new ApiError(404, "Clinic case file not found");
  }

  // Handle new file upload if provided
  if (req.file) {
    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      throw new ApiError(400, "File size must not exceed 5MB");
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];
    if (!allowedExtensions.includes(ext)) {
      throw new ApiError(
        400,
        "Invalid file format. Only PDF, JPG, PNG, DOC, and DOCX are allowed."
      );
    }

    // Upload to Cloudinary
    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      "physio-clinic/cases",
      "auto",
      req.file.originalname
    );

    // Delete old file from Cloudinary
    if (fileRecord.fileUrl) {
      try {
        await deleteFromCloudinary(fileRecord.fileUrl);
      } catch (err) {
        console.error("Failed to delete old file from Cloudinary:", err);
      }
    }

    fileRecord.fileUrl = uploaded.secure_url;
  }

  // Verify and update case reference if changed
  if (clinicCase !== undefined) {
    if (clinicCase === null || clinicCase === "" || clinicCase === "null") {
      fileRecord.clinicCase = null;
    } else if (clinicCase !== (fileRecord.clinicCase ? fileRecord.clinicCase.toString() : "")) {
      const existingCase = await ClinicCase.findById(clinicCase);
      if (!existingCase) {
        throw new ApiError(404, "Associated clinic case not found");
      }
      fileRecord.clinicCase = clinicCase;
      if (!fileRecord.patient) {
        fileRecord.patient = existingCase.patient;
      }
    }
  }

  if (patient !== undefined) {
    fileRecord.patient = patient === "" ? null : patient;
  }

  if (fileName !== undefined) fileRecord.fileName = fileName;
  if (fileType !== undefined) fileRecord.fileType = fileType;
  if (notes !== undefined) fileRecord.notes = notes;

  const updatedFile = await fileRecord.save();

  return res.status(200).json({
    message: "File updated successfully",
    file: updatedFile,
  });
});

// @desc    Delete a clinic case file (removes from db and Cloudinary)
// @route   DELETE /api/clinic/files/:id
// @access  Private/Admin
export const deleteCaseFile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const fileRecord = await ClinicCaseFile.findById(id);
  if (!fileRecord) {
    throw new ApiError(404, "Clinic case file not found");
  }

  // 1. Delete asset from Cloudinary
  if (fileRecord.fileUrl) {
    await deleteFromCloudinary(fileRecord.fileUrl);
  }

  // 2. Delete record from database
  await fileRecord.deleteOne();

  return res.status(200).json({
    message: "File deleted successfully",
  });
});
