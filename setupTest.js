//eslint-disable-next-line node/no-extraneous-require
const { jasmine } = require('@jest/globals');

jest.setTimeout(240000);

jasmine.getEnv().addReporter({
    specStarted: (result) => (jasmine.currentTest = result),
    specDone: (result) => (jasmine.currentTest = result),
});

// disable colors by default except for tests on "colors" itself
if (!jasmine.testPath.includes('test/colors/colors.test.js')) {
    process.env.NO_COLOR = true;
}
