/**
 * Parses Axios/Network error objects into user-friendly message strings.
 * Handles common status codes: 400, 401, 403, 404, 429, 500, timeouts, and offline states.
 * 
 * @param {object} error - The caught Axios error object
 * @returns {string} - Clean, human-readable error description
 */
export const getFriendlyErrorMessage = (error) => {
  if (!error) {
    return "An unknown error occurred. Please try again.";
  }

  // Handle Network timeout or offline state
  if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
    return "Connection interrupted. Please verify your internet connection.";
  }
  if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
    return "Request timed out. The server is taking too long to respond. Please try again.";
  }

  const response = error.response;
  if (!response) {
    return error.message || "No response received from the server. Please check back shortly.";
  }

  const status = response.status;
  const data = response.data;

  // Extract nested error message fields from typical Django/Express API structures
  const detail = data?.detail || data?.error || data?.message || (typeof data === "string" ? data : "");

  switch (status) {
    case 400:
      return detail || "The request could not be completed. Please review your input.";
    case 401:
      return "Session expired. Please log in again.";
    case 403:
      return "Access denied. You do not have permission to view this resource.";
    case 404:
      return "Requested resource could not be found.";
    case 429:
      return "Too many requests. Please wait a moment before trying again.";
    case 500:
    case 502:
    case 503:
    case 504:
      return "Internal server error. Our engineering team has been notified.";
    default:
      return detail || `An unexpected error occurred (Status code: ${status}).`;
  }
};
