import { Router } from "express";
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  addPatientNote,
  deletePatientNote,
} from "../controllers/clinicPatientController.js";
import { protect, authorizePermissions } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  clinicPatientCreateSchema,
  clinicPatientUpdateSchema,
  patientNoteCreateSchema,
} from "../validations/clinicPatientSchema.js";

const router = Router();

// Apply auth middleware to all routes in this router since it's for the doctor panel only
router.use(protect);

router
  .route("/")
  .post(authorizePermissions("patients:manage"), validate(clinicPatientCreateSchema), createPatient)
  .get(authorizePermissions("patients:view"), getPatients);

router
  .route("/:id")
  .get(authorizePermissions("patients:view"), getPatientById)
  .put(authorizePermissions("patients:manage"), validate(clinicPatientUpdateSchema), updatePatient)
  .delete(authorizePermissions("patients:manage"), deletePatient);

router.post("/:id/notes", authorizePermissions("patients:manage"), validate(patientNoteCreateSchema), addPatientNote);
router.delete("/:id/notes/:noteId", authorizePermissions("patients:manage"), deletePatientNote);

export default router;
