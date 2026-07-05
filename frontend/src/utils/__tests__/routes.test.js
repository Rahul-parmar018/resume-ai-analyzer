import { describe, it, expect } from "vitest";
import { getDashboardForRole } from "../routes";

describe("getDashboardForRole", () => {
  it("should map recruiter role to scanner dashboard", () => {
    expect(getDashboardForRole("recruiter")).toBe("/scanner");
  });

  it("should map candidate role to optimize dashboard", () => {
    expect(getDashboardForRole("candidate")).toBe("/optimize");
    expect(getDashboardForRole("other")).toBe("/optimize"); // Fallback check
    expect(getDashboardForRole(null)).toBe("/optimize"); // Null handling
  });
});
