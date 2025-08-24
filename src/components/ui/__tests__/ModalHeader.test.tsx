import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModalHeader from "../ModalHeader";

describe("ModalHeader", () => {
  test("renders with title", () => {
    render(<ModalHeader title="Test Title" />);
    expect(screen.getByRole("heading")).toHaveTextContent("Test Title");
  });

  test("renders with React node title", () => {
    const customTitle = <div data-testid="custom-title">Custom Title</div>;
    render(<ModalHeader title={customTitle} />);
    expect(screen.getByTestId("custom-title")).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  test("renders without title", () => {
    render(<ModalHeader />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  test("renders close button when onClose is provided", () => {
    const handleClose = jest.fn();
    render(<ModalHeader onClose={handleClose} />);
    expect(screen.getByLabelText("Close")).toBeInTheDocument();
  });

  test("does not render close button when onClose is not provided", () => {
    render(<ModalHeader />);
    expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();
  });

  test("handles close button click", async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();
    render(<ModalHeader onClose={handleClose} />);

    await user.click(screen.getByLabelText("Close"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test("renders back button when onBack is provided", () => {
    const handleBack = jest.fn();
    render(<ModalHeader onBack={handleBack} />);
    expect(screen.getByLabelText("Back")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  test("renders custom back label", () => {
    const handleBack = jest.fn();
    render(<ModalHeader onBack={handleBack} backLabel="Custom Back" />);
    expect(screen.getByText("Custom Back")).toBeInTheDocument();
  });

  test("does not render back button when onBack is not provided", () => {
    render(<ModalHeader />);
    expect(screen.queryByLabelText("Back")).not.toBeInTheDocument();
  });

  test("handles back button click", async () => {
    const user = userEvent.setup();
    const handleBack = jest.fn();
    render(<ModalHeader onBack={handleBack} />);

    await user.click(screen.getByLabelText("Back"));
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  test("applies DM Sans font to title and back label", () => {
    const handleBack = jest.fn();
    render(<ModalHeader title="Test Title" onBack={handleBack} />);

    const title = screen.getByRole("heading");
    const backLabel = screen.getByText("Back");

    expect(title).toHaveStyle({ fontFamily: "var(--font-dm-sans)" });
    expect(backLabel).toHaveStyle({ fontFamily: "var(--font-dm-sans)" });
  });

  test("renders all components together", () => {
    const handleClose = jest.fn();
    const handleBack = jest.fn();
    render(
      <ModalHeader
        title="Test Modal"
        onClose={handleClose}
        onBack={handleBack}
        backLabel="Go Back"
      />
    );

    expect(screen.getByRole("heading")).toHaveTextContent("Test Modal");
    expect(screen.getByLabelText("Close")).toBeInTheDocument();
    expect(screen.getByLabelText("Back")).toBeInTheDocument();
    expect(screen.getByText("Go Back")).toBeInTheDocument();
  });
});
