import express from "express";
import {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from "../controllers/contactController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { contactSchema } from "../validations/contactSchema.js";

const router = express.Router();

// Public
router.post("/", validate(contactSchema), createContact);

// Admin
router.get("/", protect, adminOnly, getContacts);
router.get("/:id", protect, adminOnly, getContactById);
router.patch("/:id/status", protect, adminOnly, updateContactStatus);
router.delete("/:id", protect, adminOnly, deleteContact);

export default router;