import { Testimonial } from "../models/testimonial.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

// Get approved testimonials
export const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ approved: true })
    .populate("user", "name image")
    .sort({ createdAt: -1 });

  return res.status(200).json(testimonials);
});

// Get all testimonials (Admin)
export const getAllTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find()
    .populate("user", "name image")
    .sort({ createdAt: -1 });

  return res.status(200).json(testimonials);
});

// Get testimonial by ID (Admin)
export const getTestimonialById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const testimonial = await Testimonial.findById(id).populate("user", "name image");

  if (!testimonial) {
    throw new ApiError(404, "Testimonial not found");
  }

  return res.status(200).json(testimonial);
});

// Create testimonial (Patient)
export const createTestimonial = asyncHandler(async (req, res) => {
  const { content, rating, treatment } = req.body;

  if (!content) {
    throw new ApiError(400, "Testimonial content is required");
  }

  if (!treatment) {
    throw new ApiError(400, "Treatment name is required");
  }

  const ratingVal = Number(rating || 5);
  if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
    throw new ApiError(400, "Rating must be a number between 1 and 5");
  }

  const testimonial = await Testimonial.create({
    user: req.user._id,
    patientName: req.user.name,
    content,
    rating: ratingVal,
    treatment,
  });

  return res.status(201).json({
    message: "Testimonial submitted successfully. Awaiting admin approval.",
    testimonial,
  });
});

// Update testimonial (Admin)
export const updateTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const testimonial = await Testimonial.findById(id);

  if (!testimonial) {
    throw new ApiError(404, "Testimonial not found");
  }

  const { patientName, content, approved, rating, treatment } = req.body;

  testimonial.patientName = patientName ?? testimonial.patientName;
  testimonial.content = content ?? testimonial.content;
  testimonial.treatment = treatment ?? testimonial.treatment;

  if (rating !== undefined) {
    const ratingVal = Number(rating);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      throw new ApiError(400, "Rating must be a number between 1 and 5");
    }
    testimonial.rating = ratingVal;
  }

  if (approved !== undefined) {
    testimonial.approved = approved;
  }

  const updatedTestimonial = await testimonial.save();

  return res.status(200).json({
    message: "Testimonial updated successfully",
    testimonial: updatedTestimonial,
  });
});

// Delete testimonial (Admin)
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const testimonial = await Testimonial.findById(id);

  if (!testimonial) {
    throw new ApiError(404, "Testimonial not found");
  }

  await testimonial.deleteOne();

  return res.status(200).json({
    message: "Testimonial deleted successfully",
  });
});

// Get Logged-in User Testimonials
export const getMyTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({
    user: req.user._id,
  })
    .populate("user", "name image")
    .sort({
      createdAt: -1,
    });

  res.status(200).json(testimonials);
});