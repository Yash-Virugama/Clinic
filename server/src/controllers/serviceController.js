import { Service } from "../models/service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

// Create Service
export const createService = asyncHandler(async (req, res) => {
  const { title, description, order } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required.");
  }

  let image = "";

  if (req.file) {
    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      "physio-clinic/services"
    );

    image = uploaded.secure_url;
  }

  const service = await Service.create({
    title,
    description,
    image,
    order,
  });

  res.status(201).json({
    success: true,
    message: "Service created successfully.",
    service,
  });
});

// Get All Services
export const getAllServices = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({ order: 1 });

  res.status(200).json({
    success: true,
    count: services.length,
    services,
  });
});

// Get Single Service
export const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    throw new ApiError(404, "Service not found.");
  }

  res.status(200).json({
    success: true,
    service,
  });
});

// Update Service
export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    throw new ApiError(404, "Service not found.");
  }

  service.title = req.body.title ?? service.title;
  service.description = req.body.description ?? service.description;
  service.order = req.body.order ?? service.order;

  if (req.file) {
    // Delete old image if it exists
    if (service.image) {
      await deleteFromCloudinary(service.image);
    }

    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      "physio-clinic/services"
    );

    service.image = uploaded.secure_url;
  }

  await service.save();

  res.status(200).json({
    success: true,
    message: "Service updated successfully.",
    service,
  });
});

// Delete Service
export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    throw new ApiError(404, "Service not found.");
  }

  // Delete image from Cloudinary if it exists
  if (service.image) {
    await deleteFromCloudinary(service.image);
  }

  await service.deleteOne();

  res.status(200).json({
    success: true,
    message: "Service deleted successfully.",
  });
});