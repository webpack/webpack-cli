const { cli } = require("webpack");

// Ignore core-flags test for webpack@4
const ignorePattern =
  typeof cli !== "undefined"
    ? ["<rootDir>/node_modules/"]
    : ["<rootDir>/node_modules/", "<rootDir>/test/build/core-flags"];

module.exports = {
  testPathIgnorePatterns: ignorePattern,
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: ".nyc_output",
  coverageReporters: ["json"],
  coveragePathIgnorePatterns: ["<rootDir>/test/"],
  transform: {
    "^.+\\.(ts)?$": "ts-jest",
  },
  testRegex: ["/test/.*\\.(test.js|test.ts)$"],
  moduleFileExtensions: ["ts", "js", "json"],
  snapshotResolver: "<rootDir>/scripts/snapshot-resolver.js",
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
  setupFilesAfterEnv: ["<rootDir>/scripts/setup-test.js"],
  globalTeardown: "<rootDir>/scripts/cleanup-test.js",
  globalSetup: "<rootDir>/scripts/global-setup.js",
  modulePathIgnorePatterns: [
    "<rootDir>/test/loader/test-loader",
    "<rootDir>/test/plugin/test-plugin",
  ],
};
