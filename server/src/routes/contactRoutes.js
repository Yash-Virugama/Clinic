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

import { protect, adminOnly, optionalProtect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { contactSchema } from "../validations/contactSchema.js";

const router = express.Router();

// Public / Authenticated creation
router.post("/", optionalProtect, validate(contactSchema), createContact);

// User history
router.get("/my-history", protect, getMyContactHistory);

// Admin
router.get("/", protect, adminOnly, getContacts);
router.get("/:id", protect, adminOnly, getContactById);
router.patch("/:id/status", protect, adminOnly, updateContactStatus);
router.post("/:id/reply", protect, adminOnly, replyToContact);
router.delete("/:id", protect, adminOnly, deleteContact);

export default router;