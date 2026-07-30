import { Router } from "express";
import {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} from "../controllers/clinicalRecordController.js";
import { protect, authorizePermissions } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  clinicalRecordCreateSchema,
  clinicalRecordUpdateSchema,
} from "../validations/clinicalRecordSchema.js";

const router = Router();

// Apply auth middleware to all routes in this router (doctor/admin panel access only)
router.use(protect);

router
  .route("/")
  .post(authorizePermissions("patients:manage"), validate(clinicalRecordCreateSchema), createRecord)
  .get(authorizePermissions("patients:view"), getRecords);

router
  .route("/:id")
  .get(authorizePermissions("patients:view"), getRecordById)
  .put(authorizePermissions("patients:manage"), validate(clinicalRecordUpdateSchema), updateRecord)
  .delete(authorizePermissions("patients:manage"), deleteRecord);

export default router;
