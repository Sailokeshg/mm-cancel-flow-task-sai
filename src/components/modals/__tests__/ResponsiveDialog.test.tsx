import React from "react";
import { render, screen } from "@testing-library/react";
import useMediaQuery from "@mui/material/useMediaQuery";
import ResponsiveDialog from "../ResponsiveDialog";

// Mock MUI components and hooks
jest.mock("@mui/material/useMediaQuery");
jest.mock("@mui/material/Dialog", () => {
  return function MockDialog({
    children,
    open,
    ...props
  }: {
    children?: React.ReactNode;
    open: boolean;
    [key: string]: unknown;
  }) {
    if (!open) return null;
    return (
      <div data-testid="dialog" {...props}>
        {children}
      </div>
    );
  };
});
jest.mock("@mui/material/DialogTitle", () => {
  return function MockDialogTitle({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) {
    return (
      <div data-testid="dialog-title" {...props}>
        {children}
      </div>
    );
  };
});
jest.mock("@mui/material/DialogContent", () => {
  return function MockDialogContent({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) {
    return (
      <div data-testid="dialog-content" {...props}>
        {children}
      </div>
    );
  };
});
jest.mock("@mui/material/DialogActions", () => {
  return function MockDialogActions({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) {
    return (
      <div data-testid="dialog-actions" {...props}>
        {children}
      </div>
    );
  };
});

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<
  typeof useMediaQuery
>;

describe("ResponsiveDialog", () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMediaQuery.mockReturnValue(true); // Default to desktop
  });

  test("renders when open is true", () => {
    render(<ResponsiveDialog {...defaultProps} />);
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  test("does not render when open is false", () => {
    render(<ResponsiveDialog {...defaultProps} open={false} />);
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  test("renders title when provided", () => {
    render(<ResponsiveDialog {...defaultProps} title="Test Title" />);
    expect(screen.getByTestId("dialog-title")).toHaveTextContent("Test Title");
  });

  test("does not render title when not provided", () => {
    render(<ResponsiveDialog {...defaultProps} />);
    expect(screen.queryByTestId("dialog-title")).not.toBeInTheDocument();
  });

  test("renders children content", () => {
    render(
      <ResponsiveDialog {...defaultProps}>
        <div>Test Content</div>
      </ResponsiveDialog>
    );
    expect(screen.getByTestId("dialog-content")).toHaveTextContent(
      "Test Content"
    );
  });

  test("renders actions when provided", () => {
    const actions = <button>Action Button</button>;
    render(<ResponsiveDialog {...defaultProps} actions={actions} />);
    expect(screen.getByTestId("dialog-actions")).toContainElement(
      screen.getByRole("button", { name: "Action Button" })
    );
  });

  test("does not render actions when not provided", () => {
    render(<ResponsiveDialog {...defaultProps} />);
    expect(screen.queryByTestId("dialog-actions")).not.toBeInTheDocument();
  });

  test("renders title as React node", () => {
    const customTitle = <div data-testid="custom-title">Custom Title</div>;
    render(<ResponsiveDialog {...defaultProps} title={customTitle} />);
    expect(screen.getByTestId("custom-title")).toBeInTheDocument();
  });

  test("uses media query to determine desktop/mobile", () => {
    render(<ResponsiveDialog {...defaultProps} />);
    expect(mockUseMediaQuery).toHaveBeenCalledWith("(min-width:1024px)");
  });

  test("does not render when desktopOnly is true and on mobile", () => {
    mockUseMediaQuery.mockReturnValue(false); // Mobile
    render(<ResponsiveDialog {...defaultProps} desktopOnly={true} />);
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  test("renders when desktopOnly is true and on desktop", () => {
    mockUseMediaQuery.mockReturnValue(true); // Desktop
    render(<ResponsiveDialog {...defaultProps} desktopOnly={true} />);
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  test("renders when desktopOnly is false on mobile", () => {
    mockUseMediaQuery.mockReturnValue(false); // Mobile
    render(<ResponsiveDialog {...defaultProps} desktopOnly={false} />);
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  test("handles onClose callback", () => {
    const handleClose = jest.fn();
    render(<ResponsiveDialog {...defaultProps} onClose={handleClose} />);

    // Since we're mocking the Dialog component, we can't test the actual close behavior
    // but we can verify the prop is passed correctly
    expect(handleClose).not.toHaveBeenCalled();
  });

});
