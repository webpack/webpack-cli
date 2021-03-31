'use strict';
const path = require('path');
const { runAsync } = require('../../../utils/test-utils');

describe('basic config file', () => {
    it('is able to understand and parse a very basic configuration file', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['-c', path.resolve(__dirname, 'invalid-webpack.config.js')], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`Failed to load '${path.resolve(__dirname, 'invalid-webpack.config.js')}' config`);
        expect(stdout).toBeFalsy();
    });
});
