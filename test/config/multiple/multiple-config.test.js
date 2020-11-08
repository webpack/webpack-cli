const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('Multiple config flag: ', () => {
    it('spawns multiple compilers for multiple configs', () => {
        const { stderr, exitCode } = run(__dirname, ['-c', 'webpack1.config.js', '-c', 'webpack2.config.js'], false);
        // Should contain the correct exit code
        expect(exitCode).toEqual(0);
        // Should spawn multiple compilers
        expect(stderr).toContain('amd');
        expect(stderr).toContain('commonjs');

        // should generate the correct output files
        expect(existsSync(resolve(__dirname, './dist/dist-commonjs.js'))).toBeTruthy();
        expect(existsSync(resolve(__dirname, './dist/dist-amd.js'))).toBeTruthy();
    });
});
