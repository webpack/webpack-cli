'use strict';

const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('Config:', () => {
    it('supplied config file is absent', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')], false);

        // should throw with correct exit code
        expect(exitCode).toBe(2);
        // Should contain the correct error message
        expect(stderr).not.toContain('Compilation starting...');
        expect(stderr).not.toContain('Compilation finished');
        expect(stderr).toContain(`The specified config file doesn't exist in '${resolve(__dirname, 'webpack.config.js')}'`);
        expect(stdout).toBeFalsy();
    });
});
