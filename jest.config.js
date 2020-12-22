const { cli } = require('webpack');

// Ignore core-flags test for webpack@4
const ignorePattern = typeof cli !== 'undefined' ? ['<rootDir>/node_modules/'] : ['<rootDir>/node_modules/', '<rootDir>/test/core-flags'];

module.exports = {
    testPathIgnorePatterns: ignorePattern,
    testEnvironment: 'node',
    collectCoverage: true,
    coverageReporters: ['none'],
    transform: {
        '^.+\\.(ts)?$': 'ts-jest',
    },
    testRegex: ['/__tests__/.*\\.(test.js|test.ts)$', '/test/.*\\.(test.js|test.ts)$'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
    setupFilesAfterEnv: ['<rootDir>/setupTest.js'],
    globalTeardown: '<rootDir>/scripts/cleanupTest.js',
    globalSetup: '<rootDir>/scripts/globalSetup.js',
    modulePathIgnorePatterns: ['<rootDir>/test/loader/test-loader', '<rootDir>/test/plugin/test-plugin'],
};
