'use strict';
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('config flag with empty config file', () => {
    it('should throw error with no configuration or index file', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')]);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toBeTruthy();
    });
});
