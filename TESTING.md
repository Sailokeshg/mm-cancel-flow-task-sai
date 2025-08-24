# Testing Documentation

## Overview

This project now includes comprehensive test coverage for all major components, utilities, and API endpoints. The testing setup uses Jest and React Testing Library to ensure reliability and maintainability.

## Test Setup

### Dependencies Added

- `jest` - Testing framework
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - Custom Jest matchers
- `@testing-library/user-event` - User interaction testing
- `jest-environment-jsdom` - DOM environment for Jest
- `@types/jest` - TypeScript support for Jest
- `msw` - Mock Service Worker for API mocking

### Configuration Files

- `jest.config.js` - Jest configuration with Next.js integration
- `jest.setup.js` - Global test setup and mocks
- `src/types/jest-dom.d.ts` - TypeScript definitions for jest-dom matchers

### Scripts Added

```bash
npm test           # Run all tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Test Structure

### Component Tests

All components have corresponding test files in `__tests__` directories:

#### Button Components

- `src/components/buttons/__tests__/PrimaryButton.test.tsx`
- `src/components/buttons/__tests__/OptionButton.test.tsx`

#### UI Components

- `src/components/ui/__tests__/ModalHeader.test.tsx`
- `src/components/ui/__tests__/ModalStepper.test.tsx`

#### Modal Components

- `src/components/modals/__tests__/ResponsiveDialog.test.tsx`

### Utility Tests

- `src/lib/__tests__/mockUser.test.ts`
- `src/lib/__tests__/supabase.test.ts`
- `src/lib/ui/__tests__/constants.test.ts`

### API Tests

- `src/app/api/cancellations/__tests__/route.test.ts`

### Page Tests

- `src/app/__tests__/page.test.tsx`

### Integration Tests

- `src/__tests__/testHelpers.test.ts` - Testing utilities
- `src/__tests__/cancellationFlow.e2e.test.tsx` - End-to-end flow tests

## Test Coverage

### Areas Covered

1. **Component Rendering** - All components render correctly
2. **User Interactions** - Button clicks, form submissions, modal interactions
3. **Props Handling** - Correct prop passing and default values
4. **State Management** - Component state changes and effects
5. **API Integration** - HTTP requests and responses
6. **Error Handling** - Error states and edge cases
7. **Accessibility** - ARIA attributes and semantic HTML
8. **Responsive Behavior** - Desktop/mobile rendering differences

### Test Types

1. **Unit Tests** - Individual component/utility testing
2. **Integration Tests** - Component interaction testing
3. **End-to-End Tests** - Complete user flow testing
4. **API Tests** - Backend endpoint testing

## Running Tests

### Development Workflow

```bash
# Run all tests
npm test

# Run tests in watch mode for development
npm run test:watch

# Run specific test file
npm test PrimaryButton.test.tsx

# Run tests with coverage
npm run test:coverage

# Run tests matching a pattern
npm test -- --testNamePattern="renders"
```

### Continuous Integration

The test suite is designed to run in CI environments with:

- Fast execution times
- Comprehensive mocking
- Clear error reporting
- Coverage reporting

## Mock Strategy

### Component Mocking

- Next.js components (Image, navigation)
- MUI components (Dialog, useMediaQuery)
- External dependencies

### API Mocking

- Supabase client mocking
- HTTP request/response mocking
- Environment variable mocking

### Browser API Mocking

- Console methods
- Fetch API
- Local storage (if needed)

## Testing Best Practices

### Component Testing

1. **Render Testing** - Verify components render without crashing
2. **Props Testing** - Test all prop combinations
3. **Event Testing** - Test user interactions
4. **State Testing** - Verify state changes
5. **Snapshot Testing** - When appropriate for stable components

### API Testing

1. **Success Cases** - Test successful API responses
2. **Error Cases** - Test error handling
3. **Edge Cases** - Test boundary conditions
4. **Security** - Test input validation and sanitization

### Integration Testing

1. **User Flows** - Test complete user journeys
2. **Component Interaction** - Test component communication
3. **Data Flow** - Test data passing between components

## Debugging Tests

### Common Issues

1. **Element Not Found** - Use `screen.debug()` to see rendered HTML
2. **Async Issues** - Use `waitFor()` for async operations
3. **Mock Issues** - Check mock implementations and return values

### Debugging Commands

```bash
# Debug specific test
npm test -- --testNamePattern="specific test" --verbose

# Run with additional logging
DEBUG=* npm test

# Generate coverage report
npm run test:coverage
```

## Future Improvements

### Planned Enhancements

1. **Visual Regression Testing** - Add screenshot testing
2. **Performance Testing** - Add performance benchmarks
3. **A11y Testing** - Enhanced accessibility testing
4. **E2E Testing** - Full browser automation with Playwright/Cypress

### Metrics to Track

1. **Test Coverage** - Aim for >90% coverage
2. **Test Performance** - Keep tests under 30 seconds total
3. **Test Reliability** - Minimize flaky tests
4. **Maintenance** - Regular test updates with code changes

## Test Results Summary

### Current Status

- ✅ Unit Tests: 73 passing
- ❌ Integration Tests: Some failures due to UI mismatches
- ✅ Utility Tests: All passing
- ✅ Component Tests: Most passing

### Known Issues

- E2E tests need adjustment for actual UI implementation
- Some text matching needs refinement for dynamic content
- Mock implementations may need updates as UI evolves

### Next Steps

1. Fix failing E2E tests by updating selectors
2. Add missing component test coverage
3. Implement visual regression testing
4. Set up CI/CD pipeline integration
