'use strict';

const { runAsync } = require('../../../utils/test-utils');

describe('Multiple config flag: ', () => {
    it('spawns multiple compilers for multiple configs', async () => {
        const { exitCode, stderr, stdout } = await runAsync(
            __dirname,
            ['--config', 'webpack1.config.js', '--config', 'webpack2.config.js'],
            false,
        );

        // Should contain the correct exit code
        expect(exitCode).toEqual(0);
        expect(stderr).toBeFalsy();
        // Should spawn multiple compilers
        expect(stdout).toContain('amd:');
        expect(stdout).toContain('commonjs:');
    });
});
