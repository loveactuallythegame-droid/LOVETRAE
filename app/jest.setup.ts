/**
 * Jest Setup
 * Global test configuration
 */

import '@testing-library/jest-native/extend-expect';

// Mock Expo modules
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {},
    },
  },
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock Firebase
jest.mock('./src/lib/firebaseClient', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn((cb) => {
      cb(null);
      return jest.fn();
    }),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  },
  db: {},
}));

// Mock Sentry
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
}));

// Mock PostHog
jest.mock('posthog-react-native', () => ({
  PostHogProvider: ({ children }: { children: React.ReactNode }) => children,
  usePostHog: () => ({
    capture: jest.fn(),
    identify: jest.fn(),
    reset: jest.fn(),
  }),
}));

// Global fetch mock
global.fetch = jest.fn();

// Console suppressions in test
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  // Suppress specific React Native warnings in tests
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('useNativeDriver') ||
      args[0].includes('Require cycle') ||
      args[0].includes(' deprecated '))
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});
