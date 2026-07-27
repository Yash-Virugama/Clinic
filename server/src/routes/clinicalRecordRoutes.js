import { Router } from "express";
import {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} from "../controllers/clinicalRecordController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  clinicalRecordCreateSchema,
  clinicalRecordUpdateSchema,
} from "../validations/clinicalRecordSchema.js";

const router = Router();

// Apply auth middleware to all routes in this router (doctor/admin panel access only)
router.use(protect);
router.use(adminOnly);

router
  .route("/")
  .post(validate(clinicalRecordCreateSchema), createRecord)
  .get(getRecords);

router
  .route("/:id")
  .get(getRecordById)
  .put(validate(clinicalRecordUpdateSchema), updateRecord)
  .delete(deleteRecord);

export default router;
