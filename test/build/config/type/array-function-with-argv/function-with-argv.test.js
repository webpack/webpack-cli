'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { runAsync } = require('../../../../utils/test-utils');

describe('array of function with args', () => {
    it('is able to understand a configuration file as a function', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--mode', 'development'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(existsSync(resolve(__dirname, './dist/a-dev.js')));
        expect(existsSync(resolve(__dirname, './dist/b-dev.js')));
    });
});
