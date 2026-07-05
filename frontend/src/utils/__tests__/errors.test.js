import { describe, it, expect } from "vitest";
import { getFriendlyErrorMessage } from "../errors";

describe("getFriendlyErrorMessage", () => {
  it("should handle null or undefined errors", () => {
    expect(getFriendlyErrorMessage(null)).toBe("An unknown error occurred. Please try again.");
    expect(getFriendlyErrorMessage(undefined)).toBe("An unknown error occurred. Please try again.");
  });

  it("should handle network disconnect errors", () => {
    const error = { message: "Network Error" };
    expect(getFriendlyErrorMessage(error)).toBe("Connection interrupted. Please verify your internet connection.");

    const errCode = { code: "ERR_NETWORK" };
    expect(getFriendlyErrorMessage(errCode)).toBe("Connection interrupted. Please verify your internet connection.");
  });

  it("should handle request timeout errors", () => {
    const error = { code: "ECONNABORTED" };
    expect(getFriendlyErrorMessage(error)).toBe("Request timed out. The server is taking too long to respond. Please try again.");

    const errMsg = { message: "timeout of 5000ms exceeded" };
    expect(getFriendlyErrorMessage(errMsg)).toBe("Request timed out. The server is taking too long to respond. Please try again.");
  });

  it("should handle standard status codes correctly", () => {
    const createError = (status, detail) => ({
      response: {
        status,
        data: { detail }
      }
    });

    expect(getFriendlyErrorMessage(createError(400, "Bad fields"))).toBe("Bad fields");
    expect(getFriendlyErrorMessage(createError(401))).toBe("Session expired. Please log in again.");
    expect(getFriendlyErrorMessage(createError(403))).toBe("Access denied. You do not have permission to view this resource.");
    expect(getFriendlyErrorMessage(createError(404))).toBe("Requested resource could not be found.");
    expect(getFriendlyErrorMessage(createError(429))).toBe("Too many requests. Please wait a moment before trying again.");
    expect(getFriendlyErrorMessage(createError(500))).toBe("Internal server error. Our engineering team has been notified.");
  });
});
