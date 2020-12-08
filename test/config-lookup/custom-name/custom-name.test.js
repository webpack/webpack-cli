'use strict';

const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('custom config file', () => {
    it('should work', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--config', resolve(__dirname, 'config.webpack.js')], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });
});
