import "@testing-library/jest-dom";

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock MUI's useMediaQuery
jest.mock("@mui/material/useMediaQuery", () => ({
  __esModule: true,
  default: jest.fn(() => true),
}));

// Global test utilities
global.mockConsoleError = () => {
  const spy = jest.spyOn(console, "error").mockImplementation(() => {});
  return spy;
};

global.mockConsoleWarn = () => {
  const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
  return spy;
};
