import { getApiUrl } from "../../utils/media";

/**
 * Custom API client utility wrapping standard fetch.
 * Automatically handles JSON conversion, authorization headers, and session credentials.
 */

const handleResponse = async (response) => {
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `HTTP Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

const getHeaders = (optionsHeaders = {}, isFormData = false) => {
  const headers = { ...optionsHeaders };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  const token = localStorage.getItem("admin_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  get: async (url, options = {}) => {
    const headers = getHeaders(options.headers);
    const response = await fetch(getApiUrl(url), {
      method: "GET",
      headers,
      credentials: "include",
      ...options,
    });
    return handleResponse(response);
  },

  post: async (url, body, options = {}) => {
    const isFormData = body instanceof FormData;
    const headers = getHeaders(options.headers, isFormData);

    const response = await fetch(getApiUrl(url), {
      method: "POST",
      headers,
      body: isFormData ? body : JSON.stringify(body),
      credentials: "include",
      ...options,
    });
    return handleResponse(response);
  },

  put: async (url, body, options = {}) => {
    const isFormData = body instanceof FormData;
    const headers = getHeaders(options.headers, isFormData);

    const response = await fetch(getApiUrl(url), {
      method: "PUT",
      headers,
      body: isFormData ? body : JSON.stringify(body),
      credentials: "include",
      ...options,
    });
    return handleResponse(response);
  },

  delete: async (url, options = {}) => {
    const headers = getHeaders(options.headers);
    const response = await fetch(getApiUrl(url), {
      method: "DELETE",
      headers,
      credentials: "include",
      ...options,
    });
    return handleResponse(response);
  },
};
