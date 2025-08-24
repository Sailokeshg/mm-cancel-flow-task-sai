import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveTextContent(text: string | RegExp): R
      toHaveClass(...classNames: string[]): R
      toHaveAttribute(name: string, value?: string): R
      toHaveStyle(css: Record<string, string | number> | string): R
      toBeDisabled(): R
      toBeEnabled(): R
      toBeVisible(): R
      toBeChecked(): R
    }
  }
}
