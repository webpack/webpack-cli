'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('function configuration', () => {
    it('is able to understand a configuration file as a function', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--mode', 'development'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(stdout).toContain("{ argv: { mode: 'development', env: { WEBPACK_BUNDLE: true } } }");
        expect(stdout).toContain("mode: 'development'");
        expect(existsSync(resolve(__dirname, './dist/dev.js')));
    });
});
