/**
 * E2E-style test for the complete cancellation flow
 * Tests the integration between components and API
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfilePage from "../app/page";
import { testHelpers } from "./testHelpers.test";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe("Cancellation Flow E2E", () => {
  beforeEach(() => {
    testHelpers.cleanupMocks();
  });

  afterEach(() => {
    testHelpers.cleanupMocks();
  });









  test("sign out functionality works", async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    render(<ProfilePage />);

    const signOutButton = screen.getByText(/sign out/i);
    await user.click(signOutButton);

    // Should show signing out state
    expect(screen.getByText(/signing out/i)).toBeInTheDocument();

    // Wait for sign out to complete
    await waitFor(
      () => {
        expect(consoleSpy).toHaveBeenCalledWith("User signed out");
      },
      { timeout: 2000 }
    );

    consoleSpy.mockRestore();
  });




});
