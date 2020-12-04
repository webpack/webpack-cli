'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('array of function with args', () => {
    it('is able to understand a configuration file as a function', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--mode', 'development'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'first' starting...");
        expect(stderr).toContain("Compilation 'first' finished");
        expect(stderr).toContain("Compilation 'second' starting...");
        expect(stderr).toContain("Compilation 'second' finished");
        expect(stdout).toBeTruthy();

        expect(existsSync(resolve(__dirname, './dist/a-dev.js')));
        expect(existsSync(resolve(__dirname, './dist/b-dev.js')));
    });
});
