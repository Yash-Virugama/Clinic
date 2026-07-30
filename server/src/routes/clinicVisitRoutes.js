import { Router } from "express";
import {
  createVisit,
  getVisits,
  getVisitById,
  updateVisit,
  deleteVisit,
} from "../controllers/clinicVisitController.js";
import { protect, authorizePermissions } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  clinicVisitCreateSchema,
  clinicVisitUpdateSchema,
} from "../validations/clinicVisitSchema.js";

const router = Router();

// Apply auth middleware to all routes in this router (doctor/admin panel access only)
router.use(protect);

router
  .route("/")
  .post(authorizePermissions("visits:manage"), validate(clinicVisitCreateSchema), createVisit)
  .get(authorizePermissions("visits:view"), getVisits);

router
  .route("/:id")
  .get(authorizePermissions("visits:view"), getVisitById)
  .put(authorizePermissions("visits:manage"), validate(clinicVisitUpdateSchema), updateVisit)
  .delete(authorizePermissions("visits:manage"), deleteVisit);

export default router;
