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

/**
 * Resolves the full URL for an API endpoint.
 * Prepends the VITE_API_BASE_URL environment variable if configured.
 * 
 * @param {string} path - The API endpoint path.
 * @returns {string} The full or relative URL.
 */
export const getApiUrl = (path) => {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  if (base && path.startsWith("/")) {
    return `${base.replace(/\/$/, "")}${path}`;
  }
  return `${base}${path}`;
};

