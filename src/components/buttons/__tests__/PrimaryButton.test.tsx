import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PrimaryButton from "../PrimaryButton";

describe("PrimaryButton", () => {
  test("renders with children", () => {
    render(<PrimaryButton>Click me</PrimaryButton>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  test("applies primary variant by default", () => {
    render(<PrimaryButton>Primary</PrimaryButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-[#5D3AF7]", "text-white");
  });

  test("applies success variant when specified", () => {
    render(<PrimaryButton variant="success">Success</PrimaryButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-[#28B463]", "text-white");
  });

  test("applies ghost variant when specified", () => {
    render(<PrimaryButton variant="ghost">Ghost</PrimaryButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-white", "text-gray-800", "border-gray-300");
  });

  test("handles click events", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<PrimaryButton onClick={handleClick}>Click me</PrimaryButton>);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("is disabled when disabled prop is true", () => {
    render(<PrimaryButton disabled>Disabled</PrimaryButton>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveClass("opacity-60", "cursor-not-allowed");
  });

  test("does not trigger click when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <PrimaryButton disabled onClick={handleClick}>
        Disabled
      </PrimaryButton>
    );

    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test("applies custom className", () => {
    render(<PrimaryButton className="custom-class">Button</PrimaryButton>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  test("passes through other props", () => {
    render(<PrimaryButton data-testid="test-button">Button</PrimaryButton>);
    expect(screen.getByTestId("test-button")).toBeInTheDocument();
  });

  test("applies DM Sans font family", () => {
    render(<PrimaryButton>Button</PrimaryButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveStyle({ fontFamily: "var(--font-dm-sans)" });
  });

});
