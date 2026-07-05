import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import { useAuth } from "../AuthProvider";

vi.mock("../AuthProvider", () => ({
  useAuth: vi.fn(),
}));

describe("ProtectedRoute Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loader during session initialization", () => {
    useAuth.mockReturnValue({
      user: null,
      profile: null,
      initializing: true,
      profileLoading: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Stabilizing Connection...")).toBeInTheDocument();
  });

  it("redirects unauthenticated user to login screen", () => {
    useAuth.mockReturnValue({
      user: null,
      profile: null,
      initializing: false,
      profileLoading: false,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("redirects un-onboarded user to role selection screen", () => {
    useAuth.mockReturnValue({
      user: { email: "test@example.com" },
      profile: { role: null, role_onboarding_done: false },
      initializing: false,
      profileLoading: false,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/role-selection" element={<div>Role Selection Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Role Selection Page")).toBeInTheDocument();
  });

  it("renders children when role checks pass successfully", () => {
    useAuth.mockReturnValue({
      user: { email: "candidate@example.com" },
      profile: { role: "candidate", role_onboarding_done: true },
      initializing: false,
      profileLoading: false,
    });

    render(
      <MemoryRouter initialEntries={["/optimize"]}>
        <Routes>
          <Route
            path="/optimize"
            element={
              <ProtectedRoute allowedRoles={["candidate"]}>
                <div>Candidate Workspace</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Candidate Workspace")).toBeInTheDocument();
  });
});
