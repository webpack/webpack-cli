'use strict';
const { run } = require('../utils/test-utils');
const { readFileSync } = require('fs');
const { resolve } = require('path');

describe('--hot flag', () => {
    it('should be successful when --hot is passed', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--hot']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(readFileSync(resolve(__dirname, './bin/main.js')).toString()).toContain('webpackHotUpdate');
    });

    it('should warn when --hot and --no-hot both are passed', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--no-hot', '--hot']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain(
            'You provided both --hot and --no-hot. We will use only the last of these flags that you provided in your CLI arguments',
        );
        expect(stdout).toBeTruthy();
        expect(readFileSync(resolve(__dirname, './bin/main.js')).toString()).toContain('webpackHotUpdate');
    });
});
