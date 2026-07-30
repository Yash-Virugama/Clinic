import express from "express";
import {
  getTestimonials,
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getMyTestimonials
} from "../controllers/testimonialController.js";

import { protect, authorizePermissions } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { testimonialSchema, testimonialSubmissionSchema } from "../validations/testimonialSchema.js";

const router = express.Router();

// Public & Patient
router
  .route("/")
  .get(getTestimonials)
  .post(protect, validate(testimonialSubmissionSchema), createTestimonial);

  router.get("/my", protect, getMyTestimonials);

// Admin
router.get("/admin", protect, authorizePermissions("testimonials:view"), getAllTestimonials);

router
  .route("/:id")
  .get(protect, authorizePermissions("testimonials:view"), getTestimonialById)
  .put(protect, authorizePermissions("testimonials:manage"), validate(testimonialSchema), updateTestimonial)
  .delete(protect, authorizePermissions("testimonials:manage"), deleteTestimonial);
  
export default router;