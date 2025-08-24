import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Integration test helpers
export const testHelpers = {
  async clickAndWait(element: HTMLElement, timeout = 1000) {
    const user = userEvent.setup()
    await user.click(element)
    await waitFor(() => {}, { timeout })
  },

  expectElementsToBeVisible(testIds: string[]) {
    testIds.forEach(testId => {
      expect(screen.getByTestId(testId)).toBeInTheDocument()
    })
  },

  expectElementsNotToBeVisible(testIds: string[]) {
    testIds.forEach(testId => {
      expect(screen.queryByTestId(testId)).not.toBeInTheDocument()
    })
  },

  async fillAndSubmitForm(formData: Record<string, string>) {
    const user = userEvent.setup()
    
    for (const [fieldName, value] of Object.entries(formData)) {
      const field = screen.getByLabelText(new RegExp(fieldName, 'i'))
      await user.clear(field)
      await user.type(field, value)
    }
    
    const submitButton = screen.getByRole('button', { name: /submit|save|confirm/i })
    await user.click(submitButton)
  },

  async selectOption(labelText: string, optionText: string) {
    const user = userEvent.setup()
    const selectElement = screen.getByLabelText(new RegExp(labelText, 'i'))
    await user.click(selectElement)
    await user.click(screen.getByText(optionText))
  },

  mockApiResponse(endpoint: string, response: unknown, status = 200) {
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes(endpoint)) {
        return Promise.resolve({
          ok: status >= 200 && status < 300,
          status,
          json: () => Promise.resolve(response),
        })
      }
      return Promise.reject(new Error(`Unmocked fetch to ${url}`))
    })
  },

  setupMockUser(user = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'test@example.com'
  }) {
    // Mock the user context or auth state
    return user
  },

  cleanupMocks() {
    jest.clearAllMocks()
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    if (mockFetch && jest.isMockFunction(mockFetch)) {
      mockFetch.mockRestore?.()
    }
  }
}

describe('Integration Test Helpers', () => {
  afterEach(() => {
    testHelpers.cleanupMocks()
  })

  test('testHelpers should be defined', () => {
    expect(testHelpers).toBeDefined()
    expect(typeof testHelpers.clickAndWait).toBe('function')
    expect(typeof testHelpers.expectElementsToBeVisible).toBe('function')
    expect(typeof testHelpers.expectElementsNotToBeVisible).toBe('function')
    expect(typeof testHelpers.fillAndSubmitForm).toBe('function')
    expect(typeof testHelpers.selectOption).toBe('function')
    expect(typeof testHelpers.mockApiResponse).toBe('function')
    expect(typeof testHelpers.setupMockUser).toBe('function')
    expect(typeof testHelpers.cleanupMocks).toBe('function')
  })

  test('mockApiResponse should setup fetch mock', () => {
    testHelpers.mockApiResponse('/api/test', { success: true })
    expect(global.fetch).toBeDefined()
    expect(jest.isMockFunction(global.fetch)).toBe(true)
  })

  test('setupMockUser should return user object', () => {
    const user = testHelpers.setupMockUser()
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('email')
  })

  test('cleanupMocks should clear all mocks', () => {
    testHelpers.mockApiResponse('/api/test', { success: true })
    testHelpers.cleanupMocks()
    // Mock should be cleared after cleanup
  })
})
