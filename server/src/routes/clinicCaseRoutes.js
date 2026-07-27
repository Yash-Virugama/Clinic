import { Router } from "express";
import {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
  updateCasePayments,
} from "../controllers/clinicCaseController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  clinicCaseCreateSchema,
  clinicCaseUpdateSchema,
} from "../validations/clinicCaseSchema.js";

const router = Router();

// Apply auth middleware to all routes in this router (doctor/admin panel access only)
router.use(protect);
router.use(adminOnly);

router
  .route("/")
  .post(validate(clinicCaseCreateSchema), createCase)
  .get(getCases);

router
  .route("/:id")
  .get(getCaseById)
  .put(validate(clinicCaseUpdateSchema), updateCase)
  .delete(deleteCase);

router.put("/:id/payments", updateCasePayments);

export default router;
