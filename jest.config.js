module.exports = {
    testPathIgnorePatterns: ["<rootDir>/node_modules/"],
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
    snapshotResolver: "<rootDir>/scripts/snapshotResolver.js",
    watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
    setupFilesAfterEnv: ["<rootDir>/setupTest.js"],
    globalTeardown: "<rootDir>/scripts/cleanupTest.js",
    globalSetup: "<rootDir>/scripts/globalSetup.js",
    modulePathIgnorePatterns: [
        "<rootDir>/test/loader/test-loader",
        "<rootDir>/test/plugin/test-plugin",
    ],
};
