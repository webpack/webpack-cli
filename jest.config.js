module.exports = {
    collectCoverageFrom: ['packages/*/src/**/*.{js,ts}', 'packages/webpack-cli/lib/**/*.{js,ts}'],
    testEnvironment: 'node',
    transform: {
        '^.+\\.(ts)?$': 'ts-jest',
    },
    testRegex: ['/__tests__/.*\\.(test.js|test.ts)$', '/test/.*\\.(test.js|test.ts)$'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
