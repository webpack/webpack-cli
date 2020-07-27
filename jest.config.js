const { cli } = require('webpack');

//ignore core-flags test for webpack@4
const ignorePattern = typeof cli !== 'undefined' ? ['<rootDir>/node_modules/'] : ['<rootDir>/node_modules/', '<rootDir>/test/core-flags'];

module.exports = {
    testPathIgnorePatterns: ignorePattern,
    // transformIgnorePatterns: ['<rootDir>.*(node_modules)(?!.*webpack-cli.*).*$'],
    testEnvironment: 'node',
    collectCoverage: true,
    coverageReporters: ['json', 'html', 'cobertura'],
    transform: {
        '^.+\\.(ts)?$': 'ts-jest',
    },
    testRegex: ['/__tests__/.*\\.(test.js|test.ts)$', '/test/.*\\.(test.js|test.ts)$'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
    setupFilesAfterEnv: ['<rootDir>/setupTest.js'],
    globalTeardown: '<rootDir>/scripts/cleanupTest.js',
};
