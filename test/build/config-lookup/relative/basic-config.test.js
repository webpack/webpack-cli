'use strict';

const { runAsync } = require('../../../utils/test-utils');

describe('relative path to config', () => {
    it('should work', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['-c', 'webpack.config.js', '--output-path', './binary/a'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work #2', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['-c', './webpack.config.js', '--output-path', './binary/b'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });
});
