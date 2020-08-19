'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('Config:', () => {
    it('supplied config file is absent', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')], false);
        // should throw with correct exit code
        expect(exitCode).toBe(2);
        expect(stdout).toBeFalsy();
        const configPath = resolve(__dirname, 'webpack.config.js');
        // Should contain the correct error message
        expect(stderr).toContain(`ConfigError: The specified config file doesn't exist in ${configPath}`);
        // Should not bundle
        expect(existsSync(resolve(__dirname, './binary/a.bundle.js'))).toBeFalsy();
    });
});
