/* eslint-disable */
const del = require('del');
const { posix } = require('path');

jest.setTimeout(300000);

jasmine.getEnv().addReporter({
    specStarted: (result) => (jasmine.currentTest = result),
    specDone: (result) => (jasmine.currentTest = result),
});

beforeEach(async () => {
    await del(
        [posix.join(jasmine.testPath, `../bin/*`), posix.join(jasmine.testPath, `../binary/*`), posix.join(jasmine.testPath, `../dist/*`)],
        {
            force: true,
        },
    );
});
