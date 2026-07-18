import { Resource } from "../models/resource.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
import { sendPushToAll } from "../utils/pushNotification.js";

// Create Resource
export const createResource = asyncHandler(async (req, res) => {
  const { title, description, category, published } = req.body;

  let fileUrl = "";

  if (req.file) {
    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      "physio-clinic/resources",
      "raw"
    );

    // console.log(uploaded);
    fileUrl = uploaded.secure_url;
  }

  const resource = await Resource.create({
    title,
    description,
    category,
    fileUrl,
    fileName: req.file ? req.file.originalname : "",
    published,
    author: req.user?._id,
  });
  
  if (resource.published) {
    const payload = {
      title: "New Resource Available",
      body: `A new physiotherapy exercise guide "${resource.title}" is now available.`,
      url: "/resources",
      tag: `new-resource-${resource._id}`,
    };
    sendPushToAll(payload, "resources").catch((err) => console.error("Error sending resource push notification:", err));
  }

  res.status(201).json(resource);
});

// Get Published Resources
export const getResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({ published: true })
    .populate("author", "name image")
    .sort({
      createdAt: -1,
    });

  // Dynamic backward compatibility heal: attach first admin if author is empty
  const hasMissingAuthor = resources.some((r) => !r.author);
  if (hasMissingAuthor) {
    const { User } = await import("../models/user.js");
    const defaultAdmin = await User.findOne({ role: "admin" }).select("name image");
    if (defaultAdmin) {
      resources.forEach((r) => {
        if (!r.author) {
          r.author = defaultAdmin;
        }
      });
    }
  }

  res.status(200).json(resources);
});

// Get Resource By ID
export const getResourceById = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id).populate("author", "name image");

  if (!resource || !resource.published) {
    throw new ApiError(404, "Resource not found");
  }

  if (!resource.author) {
    const { User } = await import("../models/user.js");
    const defaultAdmin = await User.findOne({ role: "admin" }).select("name image");
    if (defaultAdmin) {
      resource.author = defaultAdmin;
    }
  }

  res.status(200).json(resource);
});

// Get All Resources (Admin)
export const getAllResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find()
    .populate("author", "name image")
    .sort({ createdAt: -1 });

  const hasMissingAuthor = resources.some((r) => !r.author);
  if (hasMissingAuthor) {
    const { User } = await import("../models/user.js");
    const defaultAdmin = await User.findOne({ role: "admin" }).select("name image");
    if (defaultAdmin) {
      resources.forEach((r) => {
        if (!r.author) {
          r.author = defaultAdmin;
        }
      });
    }
  }

  res.status(200).json(resources);
});

// Update Resource
export const updateResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    throw new ApiError(404, "Resource not found");
  }

  const wasPublished = resource.published;

  resource.title = req.body.title ?? resource.title;
  resource.description = req.body.description ?? resource.description;
  resource.category = req.body.category ?? resource.category;
  resource.published = req.body.published ?? resource.published;

  if (req.file) {
    // Delete old file from Cloudinary if it exists
    if (resource.fileUrl) {
      await deleteFromCloudinary(resource.fileUrl);
    }

    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      "physio-clinic/resources",
      "raw"
    );

    resource.fileUrl = uploaded.secure_url;
    resource.fileName = req.file.originalname;
  }

  await resource.save();

  if (!wasPublished && resource.published) {
    const payload = {
      title: "New Resource Available",
      body: `A new physiotherapy exercise guide "${resource.title}" is now available.`,
      url: "/resources",
      tag: `new-resource-${resource._id}`,
    };
    sendPushToAll(payload, "resources").catch((err) => console.error("Error sending resource push notification:", err));
  }

  res.status(200).json(resource);
});

// Delete Resource
export const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    throw new ApiError(404, "Resource not found");
  }

  // Delete file from Cloudinary if it exists
  if (resource.fileUrl) {
    await deleteFromCloudinary(resource.fileUrl);
  }

  await resource.deleteOne();

  res.status(200).json({
    message: "Resource deleted successfully",
  });
});