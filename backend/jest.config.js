module.exports = {
  testEnvironment: "node",
  testMatch: [
    "**/__testing__/backend/**/*.spec.js",
    "**/__testing__/backend/**/*.test.js",
  ],
  maxWorkers: 1,
  verbose: true,
  testTimeout: 20000,
  globalSetup: "./jest.globalSetup.js",
  coverageDirectory: "../__testing__/coverage",
};
