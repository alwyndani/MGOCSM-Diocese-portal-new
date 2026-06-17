/**
 * Resolves the URL of a media file or document.
 * Supports legacy local paths (strings) and the new Cloudinary metadata format (JSON objects).
 * 
 * @param {string|object} fieldValue - The DB field value containing the path or metadata object.
 * @returns {string} The full or relative URL of the file.
 */
export const getFileUrl = (fieldValue) => {
  if (!fieldValue) return "";
  if (typeof fieldValue === "string") return fieldValue;
  if (typeof fieldValue === "object" && fieldValue !== null) {
    return fieldValue.imageUrl || "";
  }
  return "";
};
