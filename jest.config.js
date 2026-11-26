module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'farkle.js',
    '!node_modules/**',
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js',
  ],
};
