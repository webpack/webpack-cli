const { existsSync } = require('fs');
const { resolve } = require('path');
// eslint-disable-next-line node/no-missing-require
const { run } = require('../../utils/test-utils');

describe('Multiple config flag: ', () => {
    it('spawns multiple compilers for multiple configs', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['-c', 'webpack1.config.js', '-c', 'webpack2.config.js'], false);
        // Should contain the correct exit code
        expect(exitCode).toEqual(0);
        // Should spawn multiple compilers
        expect(stdout).toContain('Child amd:');
        expect(stdout).toContain('Child commonjs:');

        expect(stderr).toBeFalsy();

        // should generate the correct output files
        expect(existsSync(resolve(__dirname, './dist/dist-commonjs.js'))).toBeTruthy();
        expect(existsSync(resolve(__dirname, './dist/dist-amd.js'))).toBeTruthy();
    });
});
