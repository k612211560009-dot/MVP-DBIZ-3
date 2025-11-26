module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.spec.js"],
  maxWorkers: 1,
  verbose: true,
  testTimeout: 20000,
  globalSetup: "./jest.globalSetup.js",
};
