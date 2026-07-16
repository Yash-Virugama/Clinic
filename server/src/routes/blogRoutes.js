import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  getBlogs,
  updateBlog,
} from "../controllers/blogController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { blogSchema } from "../validations/blogSchema.js";

const router = express.Router();

// Public
router.get("/", getBlogs);

// Admin
router.post("/", protect, adminOnly, upload.single("coverImage"), validate(blogSchema), createBlog);

router.get("/admin", protect, adminOnly, getAllBlogs);
router.get("/admin/:id", protect, adminOnly, getBlogById);

router.put("/:id", protect, adminOnly, upload.single("coverImage"), validate(blogSchema), updateBlog);

router.delete("/:id", protect, adminOnly, deleteBlog);

// Public
router.get("/:slug", getBlogBySlug);

export default router;