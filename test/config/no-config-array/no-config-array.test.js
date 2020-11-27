'use strict';

const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('no configs in array', () => {
    it('is able to understand and parse a very basic configuration file', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeFalsy();
    });
});
