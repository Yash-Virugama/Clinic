import cloudinary from "../config/cloudinary.js";

/**
 * Extracts the public_id of an asset from its Cloudinary URL.
 * @param {string} url - The Cloudinary asset URL
 * @returns {string|null} The public_id of the asset or null if invalid
 */
export const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes("res.cloudinary.com")) return null;

  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    let path = parts[1];
    
    // Remove the version prefix (e.g. 'v1721111111/') if present
    if (path.startsWith("v")) {
      const slashIndex = path.indexOf("/");
      if (slashIndex !== -1) {
        path = path.substring(slashIndex + 1);
      }
    }

    // Determine if it is a raw file (checking if "/raw/" is in the URL)
    const isRaw = url.includes("/raw/upload/");
    
    // For images, Cloudinary public_ids DO NOT include the file extension
    // For raw files, Cloudinary public_ids DO include the file extension
    if (!isRaw) {
      const dotIndex = path.lastIndexOf(".");
      if (dotIndex !== -1) {
        path = path.substring(0, dotIndex);
      }
    }

    return path;
  } catch (error) {
    console.error("Error extracting public_id from Cloudinary URL:", error);
    return null;
  }
};

/**
 * Deletes an asset from Cloudinary.
 * @param {string} url - The Cloudinary asset URL
 * @returns {Promise<any>} Cloudinary deletion result
 */
const deleteFromCloudinary = async (url) => {
  if (!url) return null;

  const publicId = getPublicIdFromUrl(url);
  if (!publicId) return null;

  const isRaw = url.includes("/raw/upload/");
  const resourceType = isRaw ? "raw" : "image";

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error(`Failed to delete asset from Cloudinary: ${url}`, error);
    return null;
  }
};

export default deleteFromCloudinary;
