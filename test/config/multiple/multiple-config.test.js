'use strict';

const { run } = require('../../utils/test-utils');

describe('Multiple config flag: ', () => {
    it('spawns multiple compilers for multiple configs', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--config', 'webpack1.config.js', '--config', 'webpack2.config.js'], false);

        // Should contain the correct exit code
        expect(exitCode).toEqual(0);
        expect(stderr).toBeFalsy();
        // Should spawn multiple compilers
        expect(stdout).toContain('amd:');
        expect(stdout).toContain('commonjs:');
    });
});
