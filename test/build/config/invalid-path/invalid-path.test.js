'use strict';
const path = require('path');
const { run } = require('../../../utils/test-utils');

describe('basic config file', () => {
    it('is able to understand and parse a very basic configuration file', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', path.resolve(__dirname, 'invalid-webpack.config.js')], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`Failed to load '${path.resolve(__dirname, 'invalid-webpack.config.js')}' config`);
        expect(stdout).toBeFalsy();
    });
});
