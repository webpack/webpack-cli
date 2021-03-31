'use strict';

// eslint-disable-next-line node/no-unpublished-require
const stripAnsi = require('strip-ansi');
const { runAsync } = require('../../utils/test-utils');

describe('"analyze" option', () => {
    it('should not load webpack-bundle-analyzer plugin twice with --analyze flag and plugin', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['-c', './analyze.config.js', '--analyze']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stripAnsi(stdout)).toContain('Webpack Bundle Analyzer saved report to');
        expect(stripAnsi(stdout).match(/Webpack Bundle Analyzer saved report to/g)).toHaveLength(1);
    });
});
