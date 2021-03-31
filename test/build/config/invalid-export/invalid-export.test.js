'use strict';
const { resolve } = require('path');
const { runAsync } = require('../../../utils/test-utils');

describe('invalid export', () => {
    it('should throw error with no configuration or index file', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')]);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`Invalid configuration in '${resolve(__dirname, 'webpack.config.js')}'`);
        expect(stdout).toBeFalsy();
    });
});
