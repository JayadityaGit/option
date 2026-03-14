# Implementation Plan: Setup Testing with Vitest and React Testing Library

This plan outlines the steps to set up a robust testing environment for the Vite + React project using **Vitest** and **React Testing Library**.

## Objective
Enable unit and component testing with a fast, modern testing stack integrated with Vite.

## Key Files & Context
- `package.json`: Add dependencies and test scripts.
- `vite.config.ts`: Configure Vitest runner and environment.
- `tsconfig.app.json`: Add types for Vitest globals.
- `src/test-setup.ts`: Global configuration for tests (e.g., `jest-dom` extensions).

## Implementation Steps

### 1. Install Dependencies
Install the necessary testing libraries as dev dependencies:
- `vitest`: The test runner.
- `@testing-library/react`: Tools for testing React components.
- `@testing-library/jest-dom`: Custom matchers for DOM nodes (e.g., `toBeInTheDocument`).
- `@testing-library/user-event`: Simulate user interactions.
- `jsdom`: Browser environment for Vitest.
- `@types/jest`: (Optional but helpful) Types for common test functions.

### 2. Configure Vitest in `vite.config.ts`
Modify `vite.config.ts` to include a `test` configuration block.
- Set `globals: true` to use `describe`, `it`, `expect` without imports.
- Set `environment: 'jsdom'`.
- Reference a setup file for global configurations.

### 3. Add Test Scripts to `package.json`
- `"test": "vitest"`: Run tests in watch mode.
- `"test:ui": "vitest --ui"`: (Optional) Run Vitest with a visual UI.
- `"test:run": "vitest run"`: Run tests once (useful for CI).

### 4. Create Global Test Setup
Create `src/test-setup.ts` to import `@testing-library/jest-dom/vitest`. This ensures matchers like `.toBeInTheDocument()` are available in all tests.

### 5. Update TypeScript Configuration
Update `tsconfig.app.json` to:
- Include `vitest/globals` in the `types` array.
- Ensure the setup file is included in the compilation.

### 6. Create a Sample Test
Create `src/components/LoginButton.test.tsx` to verify the setup:
- Mock `firebase/auth` and `../firebase/firebase`.
- Test that the button renders with "Sign in with Google".
- Test that it shows "Connecting..." when clicked (simulating loading state).

## Verification & Testing
1. Run `npm run test` to ensure the runner starts and passes the sample test.
2. Verify that IDE autocompletion works for `expect` and `toBeInTheDocument`.
