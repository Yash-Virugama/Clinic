import { Setting } from "../models/setting.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

// Get branding settings
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({ name: "PhysioCare", logo: "" });
  }
  res.status(200).json(settings);
});

// Update branding settings (Admin only)
export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({ name: "PhysioCare", logo: "" });
  }

  const {
    name,
    address,
    phone,
    emergencyPhone,
    emailGeneral,
    emailRehab,
    workingHours,
    closedHours,
    mapLink,
    facebook,
    instagram,
    youtube,
  } = req.body;

  settings.name = name ?? settings.name;
  settings.address = address ?? settings.address;
  settings.phone = phone ?? settings.phone;
  settings.emergencyPhone = emergencyPhone ?? settings.emergencyPhone;
  settings.emailGeneral = emailGeneral ?? settings.emailGeneral;
  settings.emailRehab = emailRehab ?? settings.emailRehab;
  settings.workingHours = workingHours ?? settings.workingHours;
  settings.closedHours = closedHours ?? settings.closedHours;
  settings.mapLink = mapLink ?? settings.mapLink;
  settings.facebook = facebook ?? settings.facebook;
  settings.instagram = instagram ?? settings.instagram;
  settings.youtube = youtube ?? settings.youtube;

  if (req.file) {
    if (req.file.size > 5 * 1024 * 1024) {
      throw new ApiError(400, "Logo image size must be under 5MB.");
    }

    // Delete old logo image if it exists
    if (settings.logo) {
      await deleteFromCloudinary(settings.logo);
    }

    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      "physio-clinic/brand"
    );
    settings.logo = uploaded.secure_url;
  }

  await settings.save();

  res.status(200).json({
    success: true,
    message: "Settings updated successfully.",
    settings,
  });
});
