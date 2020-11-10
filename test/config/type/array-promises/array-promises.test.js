'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('array of promises', () => {
    it('is able to understand a configuration file as a promise', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.config.js'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'first' starting...");
        expect(stderr).toContain("Compilation 'first' finished");
        expect(stderr).toContain("Compilation 'second' starting...");
        expect(stderr).toContain("Compilation 'second' finished");
        expect(stdout).toBeTruthy();

        expect(existsSync(resolve(__dirname, './binary/a-promise.js'))).toBeTruthy();
        expect(existsSync(resolve(__dirname, './binary/b-promise.js'))).toBeTruthy();
    });
});
