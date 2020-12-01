'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('function', () => {
    it('is able to understand a configuration file as a function', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toBeTruthy();
        expect(existsSync(resolve(__dirname, './binary/functor.js'))).toBeTruthy();
    });
});
