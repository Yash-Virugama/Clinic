import { Router } from "express";
import {
  uploadCaseFile,
  getCaseFiles,
  getCaseFileById,
  updateCaseFile,
  deleteCaseFile,
  viewCaseFile,
} from "../controllers/clinicCaseFileController.js";
import { protect, authorizePermissions } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  clinicCaseFileCreateSchema,
  clinicCaseFileUpdateSchema,
} from "../validations/clinicCaseFileSchema.js";

const router = Router();

// Apply auth middleware to all routes in this router (doctor/admin panel access only)
router.use(protect);

router
  .route("/")
  .post(
    authorizePermissions("patients:manage"),
    upload.single("file"),
    validate(clinicCaseFileCreateSchema),
    uploadCaseFile
  )
  .get(authorizePermissions("patients:view"), getCaseFiles);

router.get("/:id/view", authorizePermissions("patients:view"), viewCaseFile);

router
  .route("/:id")
  .get(authorizePermissions("patients:view"), getCaseFileById)
  .put(
    authorizePermissions("patients:manage"),
    upload.single("file"),
    validate(clinicCaseFileUpdateSchema),
    updateCaseFile
  )
  .delete(authorizePermissions("patients:manage"), deleteCaseFile);

export default router;
