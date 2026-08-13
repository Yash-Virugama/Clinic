import { Router } from "express";
import {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
  updateCasePayments,
  getPublicInvoiceData,
} from "../controllers/clinicCaseController.js";
import { protect, authorizePermissions } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  clinicCaseCreateSchema,
  clinicCaseUpdateSchema,
} from "../validations/clinicCaseSchema.js";

const router = Router();

router.get("/public/invoice/:id", getPublicInvoiceData);

// Apply auth middleware to all routes in this router (doctor/admin panel access only)
router.use(protect);

router
  .route("/")
  .post(authorizePermissions("patients:manage"), validate(clinicCaseCreateSchema), createCase)
  .get(authorizePermissions("patients:view"), getCases);

router
  .route("/:id")
  .get(authorizePermissions("patients:view"), getCaseById)
  .put(authorizePermissions("patients:manage"), validate(clinicCaseUpdateSchema), updateCase)
  .delete(authorizePermissions("patients:manage"), deleteCase);

router.put("/:id/payments", authorizePermissions("payments:manage"), updateCasePayments);

export default router;
