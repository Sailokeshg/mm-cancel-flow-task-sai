import React from "react";
import { render, screen } from "@testing-library/react";
import ModalStepper from "../ModalStepper";

describe("ModalStepper", () => {
  test("renders correct step information", () => {
    render(<ModalStepper totalSteps={5} stepIndex={3} />);
    expect(screen.getByText("Step 3 of 5")).toBeInTheDocument();
  });

  test("renders correct number of step indicators", () => {
    const { container } = render(<ModalStepper totalSteps={4} stepIndex={2} />);
    const stepIndicators = container.querySelectorAll(".h-2.rounded-full");
    expect(stepIndicators).toHaveLength(4);
  });

  test("applies correct styles for current step", () => {
    const { container } = render(<ModalStepper totalSteps={5} stepIndex={3} />);
    const stepIndicators = container.querySelectorAll(".h-2.rounded-full");

    // Current step (index 2, which is step 3) should be wider
    expect(stepIndicators[2]).toHaveClass("w-8", "bg-green-500");
  });

  test("applies correct styles for completed steps", () => {
    const { container } = render(<ModalStepper totalSteps={5} stepIndex={3} />);
    const stepIndicators = container.querySelectorAll(".h-2.rounded-full");

    // First two steps should be completed (green but not current width)
    expect(stepIndicators[0]).toHaveClass("w-5", "bg-green-500");
    expect(stepIndicators[1]).toHaveClass("w-5", "bg-green-500");
  });

  test("applies correct styles for future steps", () => {
    const { container } = render(<ModalStepper totalSteps={5} stepIndex={3} />);
    const stepIndicators = container.querySelectorAll(".h-2.rounded-full");

    // Last two steps should be incomplete (gray)
    expect(stepIndicators[3]).toHaveClass("w-5", "bg-gray-300");
    expect(stepIndicators[4]).toHaveClass("w-5", "bg-gray-300");
  });

  test("handles edge case of first step", () => {
    render(<ModalStepper totalSteps={3} stepIndex={1} />);
    expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();

    const { container } = render(<ModalStepper totalSteps={3} stepIndex={1} />);
    const stepIndicators = container.querySelectorAll(".h-2.rounded-full");

    // Only first step should be active
    expect(stepIndicators[0]).toHaveClass("w-8", "bg-green-500");
    expect(stepIndicators[1]).toHaveClass("w-5", "bg-gray-300");
    expect(stepIndicators[2]).toHaveClass("w-5", "bg-gray-300");
  });

  test("handles edge case of last step", () => {
    render(<ModalStepper totalSteps={3} stepIndex={3} />);
    expect(screen.getByText("Step 3 of 3")).toBeInTheDocument();

    const { container } = render(<ModalStepper totalSteps={3} stepIndex={3} />);
    const stepIndicators = container.querySelectorAll(".h-2.rounded-full");

    // All steps should be green, last one should be current
    expect(stepIndicators[0]).toHaveClass("w-5", "bg-green-500");
    expect(stepIndicators[1]).toHaveClass("w-5", "bg-green-500");
    expect(stepIndicators[2]).toHaveClass("w-8", "bg-green-500");
  });

  test("applies default DM Sans font family", () => {
    render(<ModalStepper totalSteps={3} stepIndex={1} />);
    const stepText = screen.getByText("Step 1 of 3");
    expect(stepText).toHaveStyle({ fontFamily: "var(--font-dm-sans)" });
  });

  test("applies custom font family when provided", () => {
    render(
      <ModalStepper
        totalSteps={3}
        stepIndex={1}
        fontFamilyVar="var(--custom-font)"
      />
    );
    const stepText = screen.getByText("Step 1 of 3");
    expect(stepText).toHaveStyle({ fontFamily: "var(--custom-font)" });
  });

  test("handles single step", () => {
    render(<ModalStepper totalSteps={1} stepIndex={1} />);
    expect(screen.getByText("Step 1 of 1")).toBeInTheDocument();

    const { container } = render(<ModalStepper totalSteps={1} stepIndex={1} />);
    const stepIndicators = container.querySelectorAll(".h-2.rounded-full");

    expect(stepIndicators).toHaveLength(1);
    expect(stepIndicators[0]).toHaveClass("w-8", "bg-green-500");
  });
});
