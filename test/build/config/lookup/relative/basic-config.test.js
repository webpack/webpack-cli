'use strict';

const { run } = require('../../../../utils/test-utils');

describe('relative path to config', () => {
    it('should work', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', 'webpack.config.js', '--output-path', './binary/a'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.config.js', '--output-path', './binary/b'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });
});
