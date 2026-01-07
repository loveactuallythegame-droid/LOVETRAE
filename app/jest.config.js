module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: [],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironmentOptions: { customExportConditions: ['react-native'] },
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^react-native$': 'react-native',
    'react-native/jest/mock.js': '<rootDir>/jest.rn.mock.stub.js',
    '^expo-linking$': '<rootDir>/jest.expo-linking.stub.js'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-reanimated|expo|expo-.*|@expo|@supabase|@sentry|@gorhom)/)'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/src/__tests__/(games|engine|navigation)\\.spec\\.tsx?'
  ],
  collectCoverageFrom: [
    'src/lib/**/*.{ts,tsx}'
  ],
};
