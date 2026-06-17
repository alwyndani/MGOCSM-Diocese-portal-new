import cloudinary from "cloudinary";

// Configure Cloudinary using environment variables
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a local file to Cloudinary.
 * @param {string} filePath - Absolute path to local file.
 * @param {string} folder - Destination folder on Cloudinary.
 * @param {string} resourceType - Cloudinary resource type (auto, image, video, raw).
 * @returns {Promise<{imageUrl: string, publicId: string, resourceType: string}>}
 */
export const uploadToCloudinary = async (filePath, folder = "mgocsm", resourceType = "auto") => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder,
      resource_type: resourceType,
    });
    return {
      imageUrl: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    };
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    throw err;
  }
};

/**
 * Deletes a file from Cloudinary.
 * @param {string} publicId - The Cloudinary public ID.
 * @param {string} resourceType - Cloudinary resource type (image, video, raw).
 * @returns {Promise<any>}
 */
export const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) return null;
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (err) {
    console.error(`Cloudinary Delete Error for publicId ${publicId}:`, err);
    throw err;
  }
};
