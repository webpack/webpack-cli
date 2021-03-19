'use strict';

const { run } = require('../../utils/test-utils');

describe('"analyze" option', () => {
    it('should not load webpack-bundle-analyzer plugin twice with --analyze flag and plugin', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', './analyze.config.js', '--analyze']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('Webpack Bundle Analyzer saved report to');
        expect(stdout.match(/Webpack Bundle Analyzer saved report to/g)).toHaveLength(1);
    });
});
