import { mockUser, getMockUser } from '../mockUser'

describe('mockUser', () => {
  test('should have required properties', () => {
    expect(mockUser).toHaveProperty('id')
    expect(mockUser).toHaveProperty('email')
    expect(typeof mockUser.id).toBe('string')
    expect(typeof mockUser.email).toBe('string')
  })

  test('should have valid UUID format for id', () => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    expect(mockUser.id).toMatch(uuidRegex)
  })

  test('should have valid email format', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    expect(mockUser.email).toMatch(emailRegex)
  })

  test('getMockUser should return the same user object', () => {
    const result = getMockUser()
    expect(result).toEqual(mockUser)
    expect(result).toBe(mockUser)
  })
})
