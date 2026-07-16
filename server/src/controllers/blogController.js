import { Blog } from "../models/blog.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

//Create Blog
export const createBlog = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    excerpt,
    content,
    category,
    tags,
    published,
  } = req.body;

  const tagsArray = tags
    ? tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
    : [];

  const existingBlog = await Blog.findOne({ slug });

  if (existingBlog) {
    throw new ApiError(409, "Blog with this slug already exists");
  }

  let imageUrl = "";

  if (req.file) {
    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      "physio-clinic/blogs"
    );

    imageUrl = uploaded.secure_url;
  }

  const blog = await Blog.create({
    title,
    slug,
    excerpt,
    content,
    coverImage: imageUrl,
    author: req.user._id,
    category,
    tags: tagsArray,
    published,
    publishedAt: published ? new Date() : null,
  });

  res.status(201).json(blog);
});

//Get Published Blogs
export const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ published: true })
    .populate("author", "name image")
    .sort({ publishedAt: -1 });

  res.status(200).json(blogs);
});

//Get Blog By Slug
export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({
    slug: req.params.slug,
    published: true,
  }).populate("author", "name image");

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  res.status(200).json(blog);
});

//Get All Blogs (Admin)
export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find()
    .populate("author", "name image")
    .sort({ createdAt: -1 });

  res.status(200).json(blogs);
});

//Get Blog By ID (Admin)
export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate(
    "author",
    "name image"
  );

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  res.status(200).json(blog);
});

//Update Blog
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const {
    title,
    slug,
    excerpt,
    content,
    category,
    tags,
    published,
  } = req.body;

  const tagsArray = tags
    ? tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
    : [];

  if (slug && slug !== blog.slug) {
    const existingBlog = await Blog.findOne({ slug });

    if (existingBlog) {
      throw new ApiError(409, "Slug already exists");
    }
  }

  // Store previous published state
  const wasPublished = blog.published;

  // Update basic fields
  blog.title = title ?? blog.title;
  blog.slug = slug ?? blog.slug;
  blog.excerpt = excerpt ?? blog.excerpt;
  blog.content = content ?? blog.content;
  blog.category = category ?? blog.category;
  blog.tags = tags ? tagsArray : blog.tags;
  blog.published = published ?? blog.published;

  if (req.file) {
    // Delete old cover image if it exists
    if (blog.coverImage) {
      await deleteFromCloudinary(blog.coverImage);
    }

    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      "physio-clinic/blogs"
    );

    blog.coverImage = uploaded.secure_url;
  }

  if (!wasPublished && blog.published) {
    blog.publishedAt = new Date();
  }

  if (wasPublished && !blog.published) {
    blog.publishedAt = null;
  }

  await blog.save();

  res.status(200).json(blog);
});

//Delete Blog
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  // Delete cover image from Cloudinary if it exists
  if (blog.coverImage) {
    await deleteFromCloudinary(blog.coverImage);
  }

  await blog.deleteOne();

  res.status(200).json({
    message: "Blog deleted successfully",
  });
});
