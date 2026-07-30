import { Router } from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../controllers/clinicAppointmentController.js";
import { protect, authorizePermissions } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  clinicAppointmentCreateSchema,
  clinicAppointmentUpdateSchema,
} from "../validations/clinicAppointmentSchema.js";

const router = Router();

// Apply auth middleware to all routes in this router (doctor/admin panel access only)
router.use(protect);

router
  .route("/")
  .post(authorizePermissions("appointments:manage"), validate(clinicAppointmentCreateSchema), createAppointment)
  .get(authorizePermissions("appointments:view"), getAppointments);

router
  .route("/:id")
  .get(authorizePermissions("appointments:view"), getAppointmentById)
  .put(authorizePermissions("appointments:manage"), validate(clinicAppointmentUpdateSchema), updateAppointment)
  .delete(authorizePermissions("appointments:manage"), deleteAppointment);

export default router;
