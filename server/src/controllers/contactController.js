import { Contact } from "../models/contact.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { sendPushToUser } from "../utils/pushNotification.js";

// Public - Submit Contact Form
export const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !phone || !subject || !message) {
    throw new ApiError(400, "Please provide all required fields.");
  }

  const contactData = {
    name,
    email,
    phone,
    subject,
    message,
  };

  if (req.user) {
    contactData.userId = req.user._id;
  }

  const contact = await Contact.create(contactData);

  // Notify admins
  (async () => {
    try {
      const { User } = await import("../models/user.js");
      const admins = await User.find({ role: "admin" });
      const payload = {
        title: "New Contact Message",
        body: `You have received a new contact enquiry from ${contact.name}.`,
        url: "/admin/contacts",
        tag: `new-contact-${contact._id}`,
      };
      for (const admin of admins) {
        await sendPushToUser(admin._id, payload, "account");
      }
    } catch (err) {
      console.error("Error sending admin contact notification:", err);
    }
  })();

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

  if (status === "replied") {
    if (!contact.userId) {
      throw new ApiError(400, "Cannot set status to Replied for unregistered users.");
    }
    if (!contact.replyMessage) {
      throw new ApiError(400, "Cannot set status to Replied without a reply message.");
    }
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

// User - Get My Contact History
export const getMyContactHistory = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ userId: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts,
  });
});

// Admin - Reply to Contact
export const replyToContact = asyncHandler(async (req, res) => {
  const { replyMessage } = req.body;

  if (!replyMessage || !replyMessage.trim()) {
    throw new ApiError(400, "Reply message cannot be empty.");
  }

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    throw new ApiError(404, "Contact not found.");
  }

  if (!contact.userId) {
    throw new ApiError(400, "Cannot reply to an inquiry from a non-registered user.");
  }

  contact.replyMessage = replyMessage;
  contact.repliedAt = new Date();
  contact.status = "replied";

  await contact.save();

  // Notify the user via push notification
  (async () => {
    try {
      const payload = {
        title: "Reply to your inquiry",
        body: `Our team has replied to your message: "${replyMessage.substring(0, 50)}..."`,
        url: "/dashboard/contact",
        tag: `contact-reply-${contact._id}`,
      };
      await sendPushToUser(contact.userId, payload, "account");
    } catch (err) {
      console.error("Error sending reply notification:", err);
    }
  })();

  res.status(200).json({
    success: true,
    message: "Reply sent successfully.",
    data: contact,
  });
});