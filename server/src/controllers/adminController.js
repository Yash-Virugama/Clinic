import asyncHandler from "../utils/asyncHandler.js";

import { Service } from "../models/service.js";
import { Blog } from "../models/blog.js";
import { Resource } from "../models/resource.js";
import { Testimonial } from "../models/testimonial.js";
import { Contact } from "../models/contact.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalServices,
    totalBlogs,
    totalResources,
    pendingTestimonials,
    totalContacts,
  ] = await Promise.all([
    Service.countDocuments(),
    Blog.countDocuments(),
    Resource.countDocuments(),
    Testimonial.countDocuments({ approved: false }),
    Contact.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalServices,
      totalBlogs,
      totalResources,
      pendingTestimonials,
      totalContacts,
    },
  });
});