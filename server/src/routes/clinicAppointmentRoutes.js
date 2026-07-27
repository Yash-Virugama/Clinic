import { Router } from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../controllers/clinicAppointmentController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  clinicAppointmentCreateSchema,
  clinicAppointmentUpdateSchema,
} from "../validations/clinicAppointmentSchema.js";

const router = Router();

// Apply auth middleware to all routes in this router (doctor/admin panel access only)
router.use(protect);
router.use(adminOnly);

router
  .route("/")
  .post(validate(clinicAppointmentCreateSchema), createAppointment)
  .get(getAppointments);

router
  .route("/:id")
  .get(getAppointmentById)
  .put(validate(clinicAppointmentUpdateSchema), updateAppointment)
  .delete(deleteAppointment);

export default router;
