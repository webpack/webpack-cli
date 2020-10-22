'use strict';
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('invalid export', () => {
    it('should throw error with no configuration or index file', () => {
        const { stderr, exitCode } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')]);

        expect(stderr).toBeTruthy();
        expect(stderr).toContain('Invalid configuration object');

        expect(exitCode).toBe(1);
    });
});
