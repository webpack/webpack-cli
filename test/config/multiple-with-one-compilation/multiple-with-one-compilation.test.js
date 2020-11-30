'use strict';

const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('basic config file', () => {
    it('is able to understand and parse a very basic configuration file', () => {
        const { exitCode, stderr, stdout } = run(
            __dirname,
            ['-c', resolve(__dirname, 'webpack.config.js'), '--output-path', './binary'],
            false,
        );
        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toBeTruthy();
    });
});
