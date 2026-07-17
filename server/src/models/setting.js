import mongoose, { Schema } from "mongoose";

const settingSchema = new Schema(
  {
    name: {
      type: String,
      default: "PhysioCare",
    },
    appName: {
      type: String,
      default: "PhysioCare",
    },
    shortName: {
      type: String,
      default: "PhysioCare",
    },
    logo: {
      type: String,
      default: "", // Stores Cloudinary URL of uploaded PNG/SVG logo
    },
    favicon: {
      type: String,
      default: "", // Stores Cloudinary URL of uploaded PNG/ICO favicon
    },
    pwaIcon: {
      type: String,
      default: "", // Stores Cloudinary URL of uploaded PNG PWA icon
    },
    heroImage: {
      type: String,
      default: "", // Stores Cloudinary URL of uploaded PNG/JPG hero image
    },
    address: {
      type: String,
      default: "123 Health Street, Ahmedabad, Gujarat 380015",
    },
    phone: {
      type: String,
      default: "+91 98765 43210",
    },
    emergencyPhone: {
      type: String,
      default: "+91 98765 43211",
    },
    emailGeneral: {
      type: String,
      default: "contact@physiocare.com",
    },
    emailRehab: {
      type: String,
      default: "rehab@physiocare.com",
    },
    workingHours: {
      type: String,
      default: "Mon – Sat: 9 AM – 7 PM",
    },
    closedHours: {
      type: String,
      default: "Sunday: Closed",
    },
    mapLink: {
      type: String,
      default: "https://www.google.com/maps?q=Ahmedabad,Gujarat&output=embed",
    },
    facebook: {
      type: String,
      default: "https://facebook.com",
    },
    instagram: {
      type: String,
      default: "https://instagram.com",
    },
    youtube: {
      type: String,
      default: "https://youtube.com",
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);
export { Setting };
