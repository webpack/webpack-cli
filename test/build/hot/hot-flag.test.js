'use strict';
const { runAsync } = require('../../utils/test-utils');
const { readFileSync } = require('fs');
const { resolve } = require('path');

describe('--hot flag', () => {
    it('should be successful when --hot is passed', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--hot']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(readFileSync(resolve(__dirname, './dist/main.js')).toString()).toContain('webpackHotUpdate');
    });

    it('should be successful when --hot=only is passed', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--hot', 'only']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(readFileSync(resolve(__dirname, './dist/main.js')).toString()).toContain('webpackHotUpdate');
    });

    it('should throw an error for invalid value', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--hot', 'unknown']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`[webpack-cli] 'unknown' is an invalid value for the --hot option. Use 'only' instead.`);
        expect(stdout).toBeFalsy();
    });

    it('should be successful when --no-hot is passed', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--no-hot']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(readFileSync(resolve(__dirname, './dist/main.js')).toString()).not.toContain('webpackHotUpdate');
    });
});
