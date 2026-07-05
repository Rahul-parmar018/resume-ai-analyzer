import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PageLoader from "../PageLoader";

describe("PageLoader Component", () => {
  it("should render loading text", () => {
    render(<PageLoader />);
    expect(screen.getByText("Loading Component...")).toBeInTheDocument();
  });
});
