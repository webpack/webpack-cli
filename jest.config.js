module.exports = {
  testEnvironment: "node",
  coverageProvider: "v8",
  collectCoverage: false,
  collectCoverageFrom: ["packages/*/src/**/*.ts"],
  coverageDirectory: ".jest_coverage",
  coverageReporters: ["json"],
  transform: {
    "^.+\\.tsx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: true,
          },
          target: "es2022",
        },
        module: {
          type: "es6",
        },
      },
    ],
  },
  testRegex: ["/test/.*\\.(test.js|test.cjs|test.mjs|test.ts|test.cts|test.mts)$"],
  moduleFileExtensions: ["ts", "cts", "mts", "js", "cjs", "mjs", "json"],
  snapshotResolver: "<rootDir>/scripts/snapshot-resolver.js",
  setupFilesAfterEnv: ["<rootDir>/scripts/setup-test.js"],
  globalTeardown: "<rootDir>/scripts/cleanup-test.js",
  globalSetup: "<rootDir>/scripts/global-setup.js",
};
