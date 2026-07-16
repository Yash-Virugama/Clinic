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

import { protect, adminOnly } from "../middlewares/authMiddleware.js";
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
router.get("/admin", protect, adminOnly, getAllTestimonials);

router
  .route("/:id")
  .get(protect, adminOnly, getTestimonialById)
  .put(protect, adminOnly, validate(testimonialSchema), updateTestimonial)
  .delete(protect, adminOnly, deleteTestimonial);
  
export default router;