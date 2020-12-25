const stripAnsi = require('strip-ansi');

const { run } = require('../../utils/test-utils');

describe('Multiple config flag: ', () => {
    it('spawns multiple compilers for multiple configs', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', 'webpack1.config.js', '-c', 'webpack2.config.js'], false);

        // Should contain the correct exit code
        expect(exitCode).toEqual(0);
        expect(stderr).toBeFalsy();
        // Should spawn multiple compilers
        expect(stripAnsi(stdout)).toContain('amd:');
        expect(stripAnsi(stdout)).toContain('commonjs:');
    });
});
