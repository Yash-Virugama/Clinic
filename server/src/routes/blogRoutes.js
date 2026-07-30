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
import { protect, authorizePermissions } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { blogSchema } from "../validations/blogSchema.js";

const router = express.Router();

// Public
router.get("/", getBlogs);

// Admin
router.post("/", protect, authorizePermissions("blogs:manage"), upload.single("coverImage"), validate(blogSchema), createBlog);

router.get("/admin", protect, authorizePermissions("blogs:view"), getAllBlogs);
router.get("/admin/:id", protect, authorizePermissions("blogs:view"), getBlogById);

router.put("/:id", protect, authorizePermissions("blogs:manage"), upload.single("coverImage"), validate(blogSchema), updateBlog);

router.delete("/:id", protect, authorizePermissions("blogs:manage"), deleteBlog);

// Public
router.get("/:slug", getBlogBySlug);

export default router;