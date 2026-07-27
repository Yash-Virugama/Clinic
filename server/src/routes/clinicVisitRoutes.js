import { Router } from "express";
import {
  createVisit,
  getVisits,
  getVisitById,
  updateVisit,
  deleteVisit,
} from "../controllers/clinicVisitController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  clinicVisitCreateSchema,
  clinicVisitUpdateSchema,
} from "../validations/clinicVisitSchema.js";

const router = Router();

// Apply auth middleware to all routes in this router (doctor/admin panel access only)
router.use(protect);
router.use(adminOnly);

router
  .route("/")
  .post(validate(clinicVisitCreateSchema), createVisit)
  .get(getVisits);

router
  .route("/:id")
  .get(getVisitById)
  .put(validate(clinicVisitUpdateSchema), updateVisit)
  .delete(deleteVisit);

export default router;
