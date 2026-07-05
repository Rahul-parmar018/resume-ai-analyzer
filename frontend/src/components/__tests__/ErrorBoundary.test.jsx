import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "../ErrorBoundary";

const BuggyComponent = () => {
  throw new Error("Simulated crash");
};

describe("ErrorBoundary Component", () => {
  it("renders children normally when no error occurs", () => {
    render(
      <ErrorBoundary>
        <div>Safe Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("Safe Content")).toBeInTheDocument();
  });

  it("renders fallback UI when a child crashes", () => {
    // Suppress console.error call for the expected thrown error to clean up test logs
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("System Interrupted")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reload Application" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go to Dashboard" })).toBeInTheDocument();

    spy.mockRestore();
  });
});
