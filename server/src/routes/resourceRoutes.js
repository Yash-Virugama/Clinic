import express from "express";
import {
  createResource,
  deleteResource,
  getAllResources,
  getResourceById,
  getResources,
  updateResource,
} from "../controllers/resourceController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { resourceSchema } from "../validations/resourceSchema.js";

const router = express.Router();

// Public
router.get("/", getResources);

// Admin
router.post("/", protect, adminOnly, upload.single("file"), validate(resourceSchema), createResource);
router.get("/admin", protect, adminOnly, getAllResources);
router.put("/:id", protect, adminOnly, upload.single("file"), validate(resourceSchema), updateResource);
router.delete("/:id", protect, adminOnly, deleteResource);

// Public
router.get("/:id", getResourceById);

export default router;