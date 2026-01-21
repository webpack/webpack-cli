module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: ".nyc_output",
  coverageReporters: ["json"],
  coveragePathIgnorePatterns: ["<rootDir>/test/"],
  transform: {
    "^.+\\.(ts)?$": "ts-jest",
  },
  testRegex: ["/test/.*\\.(test.js|test.cjs|test.mjs|test.ts|test.cts|test.mts)$"],
  moduleFileExtensions: ["ts", "cts", "mts", "js", "cjs", "mjs", "json"],
  snapshotResolver: "<rootDir>/scripts/snapshot-resolver.js",
  setupFilesAfterEnv: ["<rootDir>/scripts/setup-test.js"],
  globalTeardown: "<rootDir>/scripts/cleanup-test.js",
  globalSetup: "<rootDir>/scripts/global-setup.js",
  modulePathIgnorePatterns: [
    "<rootDir>/test/loader/test-loader",
    "<rootDir>/test/plugin/test-plugin",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/packages/create-webpack-app/templates/init/webpack-defaults/*",
  ],
};
