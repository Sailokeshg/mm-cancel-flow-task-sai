import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OptionButton from "../OptionButton";

describe("OptionButton", () => {
  const defaultProps = {
    label: "Test Option",
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with label", () => {
    render(<OptionButton {...defaultProps} />);
    expect(screen.getByRole("button")).toHaveTextContent("Test Option");
  });

  test("applies inactive styles by default", () => {
    render(<OptionButton {...defaultProps} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "bg-[#F5F7FA]",
      "border-[#E7ECF2]",
      "text-gray-700"
    );
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  test("applies active styles when active prop is true", () => {
    render(<OptionButton {...defaultProps} active={true} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "bg-[#8B5CF6]",
      "border-[#8B5CF6]",
      "text-white"
    );
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  test("handles click events", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<OptionButton {...defaultProps} onClick={handleClick} />);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("applies DM Sans font family", () => {
    render(<OptionButton {...defaultProps} />);
    const button = screen.getByRole("button");
    expect(button).toHaveStyle({ fontFamily: "var(--font-dm-sans)" });
  });

  test("has proper button semantics", () => {
    render(<OptionButton {...defaultProps} />);
    const button = screen.getByRole("button");
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("type", "button");
  });

  test("toggles between active and inactive states", () => {
    const { rerender } = render(
      <OptionButton {...defaultProps} active={false} />
    );
    let button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");

    rerender(<OptionButton {...defaultProps} active={true} />);
    button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});
