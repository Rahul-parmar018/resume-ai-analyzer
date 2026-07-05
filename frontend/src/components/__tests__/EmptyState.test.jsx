import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EmptyState from "../EmptyState";

describe("EmptyState Component", () => {
  it("should render title and description correctly", () => {
    render(
      <EmptyState
        icon={<span>Icon</span>}
        title="No items found"
        description="Try adding some items to your list."
      />
    );

    expect(screen.getByText("No items found")).toBeInTheDocument();
    expect(screen.getByText("Try adding some items to your list.")).toBeInTheDocument();
    expect(screen.getByText("Icon")).toBeInTheDocument();
  });

  it("should render action element when provided", () => {
    render(
      <EmptyState
        title="Empty"
        description="Empty list"
        action={<button>Add Item</button>}
      />
    );

    expect(screen.getByRole("button", { name: "Add Item" })).toBeInTheDocument();
  });
});
