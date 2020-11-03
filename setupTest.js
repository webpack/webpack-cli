/* eslint-disable */
const rimraf = require('rimraf');
const { join } = require('path');

const outputDirectories = ['bin', 'binary', 'dist'];

jest.setTimeout(300000);

jasmine.getEnv().addReporter({
    specStarted: (result) => (jasmine.currentTest = result),
    specDone: (result) => (jasmine.currentTest = result),
});

beforeEach((done) => {
    outputDirectories.forEach((dir) => {
        rimraf(join(jasmine.testPath, `../${dir}/*`), () => {
            done();
        });
    });
});
