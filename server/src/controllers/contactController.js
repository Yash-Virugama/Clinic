import { Contact } from "../models/contact.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

// Public - Submit Contact Form
export const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !phone || !subject || !message) {
    throw new ApiError(400, "Please provide all required fields.");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    subject,
    message,
  });

  res.status(201).json({
    success: true,
    message: "Your message has been sent successfully.",
    data: contact,
  });
});

// Admin - Get All Contacts
export const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "email",
        foreignField: "email",
        as: "userProfile",
      },
    },
    {
      $addFields: {
        userImage: { $arrayElemAt: ["$userProfile.image", 0] },
      },
    },
    {
      $project: {
        userProfile: 0,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts,
  });
});

// Admin - Get Single Contact
export const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    throw new ApiError(404, "Contact not found.");
  }

  res.status(200).json({
    success: true,
    data: contact,
  });
});

// Admin - Update Contact Status
export const updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    throw new ApiError(404, "Contact not found.");
  }

  contact.status = status || contact.status;

  await contact.save();

  res.status(200).json({
    success: true,
    message: "Contact status updated successfully.",
    data: contact,
  });
});

// Admin - Delete Contact
export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    throw new ApiError(404, "Contact not found.");
  }

  await contact.deleteOne();

  res.status(200).json({
    success: true,
    message: "Contact deleted successfully.",
  });
});