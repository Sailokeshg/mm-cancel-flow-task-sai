// dev-time mock user used by the UI when real auth is out of scope
export const mockUser = {
  // Matches seeded user in seed.sql for local dev
  id: '550e8400-e29b-41d4-a716-446655440001',
  email: 'user1@example.com',
};

export function getMockUser() {
  return mockUser;
}
