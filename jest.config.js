module.exports = {
  preset: 'react-native',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    '<rootDir>/database/test.ts',
  ],
  setupFiles: [
    '<rootDir>/jest.setup.ts',
    './node_modules/react-native-gesture-handler/jestSetup.js'
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|@react-navigation/.*|react-native-reanimated|react-native-gesture-handler)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^expo(\\/.*)?$': '<rootDir>/__mocks__/expo.ts',
  },
  collectCoverage: true,
};