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
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  clinicPatientCreateSchema,
  clinicPatientUpdateSchema,
  patientNoteCreateSchema,
} from "../validations/clinicPatientSchema.js";

const router = Router();

// Apply auth middleware to all routes in this router since it's for the doctor panel only
router.use(protect);
router.use(adminOnly);

router
  .route("/")
  .post(validate(clinicPatientCreateSchema), createPatient)
  .get(getPatients);

router
  .route("/:id")
  .get(getPatientById)
  .put(validate(clinicPatientUpdateSchema), updatePatient)
  .delete(deletePatient);

router.post("/:id/notes", validate(patientNoteCreateSchema), addPatientNote);
router.delete("/:id/notes/:noteId", deletePatientNote);

export default router;
