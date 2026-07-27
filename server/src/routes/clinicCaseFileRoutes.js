import { Router } from "express";
import {
  uploadCaseFile,
  getCaseFiles,
  getCaseFileById,
  updateCaseFile,
  deleteCaseFile,
} from "../controllers/clinicCaseFileController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  clinicCaseFileCreateSchema,
  clinicCaseFileUpdateSchema,
} from "../validations/clinicCaseFileSchema.js";

const router = Router();

// Apply auth middleware to all routes in this router (doctor/admin panel access only)
router.use(protect);
router.use(adminOnly);

router
  .route("/")
  .post(
    upload.single("file"),
    validate(clinicCaseFileCreateSchema),
    uploadCaseFile
  )
  .get(getCaseFiles);

router
  .route("/:id")
  .get(getCaseFileById)
  .put(
    upload.single("file"),
    validate(clinicCaseFileUpdateSchema),
    updateCaseFile
  )
  .delete(deleteCaseFile);

export default router;
