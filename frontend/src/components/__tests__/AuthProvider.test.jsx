import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AuthProvider, { useAuth } from "../AuthProvider";
import { onAuthStateChanged } from "firebase/auth";
import api from "../../api-client";

// Mock Firebase Auth
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
  getAuth: vi.fn(() => ({})),
}));

vi.mock("../firebase", () => ({
  auth: {
    currentUser: {
      getIdToken: vi.fn(() => Promise.resolve("mock-token")),
    },
  },
}));

// Mock API Client
vi.mock("../../api-client", () => ({
  default: {
    get: vi.fn(),
  },
}));

// Test helper component
const TestConsumer = () => {
  const { user, profile, initializing } = useAuth();
  if (initializing) return <div>Initializing</div>;
  return (
    <div>
      <div data-testid="user">{user ? user.email : "No User"}</div>
      <div data-testid="profile">{profile ? profile.role : "No Profile"}</div>
    </div>
  );
};

describe("AuthProvider Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handles unauthenticated state cleanly", async () => {
    onAuthStateChanged.mockImplementation((authInstance, callback) => {
      callback(null);
      return () => {};
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("user")).toHaveTextContent("No User");
    expect(screen.getByTestId("profile")).toHaveTextContent("No Profile");
  });

  it("bootstraps session and profile for authenticated user", async () => {
    const mockUser = {
      email: "test@example.com",
      getIdToken: vi.fn(() => Promise.resolve("valid-token")),
    };
    onAuthStateChanged.mockImplementation((authInstance, callback) => {
      callback(mockUser);
      return () => {};
    });

    api.get.mockResolvedValue({
      data: {
        role: "candidate",
        role_onboarding_done: true,
      },
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("test@example.com");
      expect(screen.getByTestId("profile")).toHaveTextContent("candidate");
    });
  });
});
