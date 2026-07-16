import { Router } from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { serviceSchema } from "../validations/serviceSchema.js";

const router = Router();

router
  .route("/")
  .get(getAllServices)
  .post(protect, adminOnly, upload.single("image"), validate(serviceSchema), createService);

router
  .route("/:id")
  .get(getServiceById)
  .put(protect, adminOnly, upload.single("image"), validate(serviceSchema), updateService)
  .delete(protect, adminOnly, deleteService);

export default router;