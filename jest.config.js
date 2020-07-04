module.exports = {
    testPathIgnorePatterns: ['<rootDir>/node_modules/'],
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
