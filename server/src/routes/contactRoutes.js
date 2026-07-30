import express from "express";
import {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getMyContactHistory,
  replyToContact,
} from "../controllers/contactController.js";

import { protect, authorizePermissions, optionalProtect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { contactSchema } from "../validations/contactSchema.js";

const router = express.Router();

// Public / Authenticated creation
router.post("/", optionalProtect, validate(contactSchema), createContact);

// User history
router.get("/my-history", protect, getMyContactHistory);

// Admin
router.get("/", protect, authorizePermissions("contacts:view"), getContacts);
router.get("/:id", protect, authorizePermissions("contacts:view"), getContactById);
router.patch("/:id/status", protect, authorizePermissions("contacts:view"), updateContactStatus);
router.post("/:id/reply", protect, authorizePermissions("contacts:view"), replyToContact);
router.delete("/:id", protect, authorizePermissions("contacts:manage"), deleteContact);

export default router;