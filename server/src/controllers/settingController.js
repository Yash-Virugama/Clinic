import { Setting } from "../models/setting.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

// Get branding settings
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({ 
      name: "PhysioCare", 
      logo: "", 
      heroImage: "", 
      favicon: "",
      pwaIcon: "",
      appName: "PhysioCare",
      shortName: "PhysioCare"
    });
  }
  res.status(200).json(settings);
});

// Update branding settings (Admin only)
export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({ 
      name: "PhysioCare", 
      logo: "", 
      heroImage: "", 
      favicon: "",
      pwaIcon: "",
      appName: "PhysioCare",
      shortName: "PhysioCare"
    });
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
    appName,
    shortName,
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
  settings.appName = appName ?? settings.appName;
  settings.shortName = shortName ?? settings.shortName;

  const logoFile = req.files?.["logo"]?.[0];
  const heroImageFile = req.files?.["heroImage"]?.[0];
  const faviconFile = req.files?.["favicon"]?.[0];
  const pwaIconFile = req.files?.["pwaIcon"]?.[0];

  if (logoFile) {
    if (logoFile.size > 5 * 1024 * 1024) {
      throw new ApiError(400, "Logo image size must be under 5MB.");
    }

    // Delete old logo image if it exists
    if (settings.logo) {
      await deleteFromCloudinary(settings.logo);
    }

    const uploaded = await uploadToCloudinary(
      logoFile.buffer,
      "physio-clinic/brand"
    );
    settings.logo = uploaded.secure_url;
  }

  if (faviconFile) {
    if (faviconFile.size > 2 * 1024 * 1024) {
      throw new ApiError(400, "Favicon image size must be under 2MB.");
    }

    // Delete old favicon if it exists
    if (settings.favicon) {
      await deleteFromCloudinary(settings.favicon);
    }

    const uploaded = await uploadToCloudinary(
      faviconFile.buffer,
      "physio-clinic/brand"
    );
    settings.favicon = uploaded.secure_url;
  }

  if (pwaIconFile) {
    if (pwaIconFile.size > 5 * 1024 * 1024) {
      throw new ApiError(400, "PWA Icon image size must be under 5MB.");
    }

    // Delete old PWA icon if it exists
    if (settings.pwaIcon) {
      await deleteFromCloudinary(settings.pwaIcon);
    }

    const uploaded = await uploadToCloudinary(
      pwaIconFile.buffer,
      "physio-clinic/brand"
    );
    settings.pwaIcon = uploaded.secure_url;
  }

  if (heroImageFile) {
    if (heroImageFile.size > 5 * 1024 * 1024) {
      throw new ApiError(400, "Hero image size must be under 5MB.");
    }

    // Delete old hero image if it exists
    if (settings.heroImage) {
      await deleteFromCloudinary(settings.heroImage);
    }

    const uploaded = await uploadToCloudinary(
      heroImageFile.buffer,
      "physio-clinic/brand"
    );
    settings.heroImage = uploaded.secure_url;
  }

  await settings.save();

  res.status(200).json({
    success: true,
    message: "Settings updated successfully.",
    settings,
  });
});

// Serve dynamic PWA manifest (Public)
export const getManifest = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = {
      name: "PhysioCare",
      appName: "PhysioCare",
      shortName: "PhysioCare",
      pwaIcon: ""
    };
  }

  const pwaIconSrc = settings.pwaIcon || "/emerald-192.png";
  const activeName = settings.appName || settings.name || "PhysioCare";
  const activeShortName = settings.shortName || settings.name || "PhysioCare";

  const manifest = {
    name: activeName,
    short_name: activeShortName,
    description: "Professional Physiotherapy Clinic",
    theme_color: "#2563eb",
    background_color: "#f8fafc",
    display: "standalone",
    orientation: "portrait",
    start_url: "/",
    scope: "/",
    icons: [
      {
        src: pwaIconSrc,
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: pwaIconSrc,
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  };

  res.setHeader("Content-Type", "application/manifest+json");
  res.status(200).json(manifest);
});
