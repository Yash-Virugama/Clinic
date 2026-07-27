import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

/**
 * Uploads a file buffer to Cloudinary, ensuring proper filename/extension tracking
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} folder - Destination folder on Cloudinary
 * @param {string} resourceType - Resource type ('auto', 'image', 'raw')
 * @param {string|null} originalName - Original filename with extension
 * @returns {Promise<any>} Cloudinary upload result
 */
const uploadToCloudinary = (
  fileBuffer,
  folder,
  resourceType = "auto",
  originalName = null
) => {
  return new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type: resourceType,
    };

    if (originalName) {
      const extIndex = originalName.lastIndexOf(".");
      const nameWithoutExt = extIndex !== -1 ? originalName.substring(0, extIndex) : originalName;
      // Clean special characters from the filename to satisfy Cloudinary naming rules
      const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, "_");
      const ext = extIndex !== -1 ? originalName.substring(extIndex) : "";

      const isRaw = [".doc", ".docx"].includes(ext.toLowerCase());
      const isPdf = ext.toLowerCase() === ".pdf";
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

      if (isRaw) {
        options.resource_type = "raw";
      } else if (isPdf) {
        options.resource_type = "image"; // PDF belongs to 'image' type for Cloudinary inline document rendering
      }

      // Raw files require the extension inside the public_id to be served with it.
      // PDF and standard image files must NOT have the extension inside the public_id to prevent double extensions.
      options.public_id = isRaw
        ? `${cleanName}-${uniqueSuffix}${ext}`
        : `${cleanName}-${uniqueSuffix}`;
      options.use_filename = true;
      options.unique_filename = true;
    }

    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(fileBuffer).pipe(stream);
  });
};

export default uploadToCloudinary;