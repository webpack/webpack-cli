const { run } = require('../../utils/test-utils');

describe('Multiple config flag: ', () => {
    it('spawns multiple compilers for multiple configs', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', 'webpack1.config.js', '-c', 'webpack2.config.js'], false);

        // Should contain the correct exit code
        expect(exitCode).toEqual(0);

        expect(stderr).toContain("Compilation 'amd' starting...");
        expect(stderr).toContain("Compilation 'amd' finished");
        expect(stderr).toContain("Compilation 'commonjs' starting...");
        expect(stderr).toContain("Compilation 'commonjs' finished");

        // Should spawn multiple compilers
        expect(stdout).toContain('amd:');
        expect(stdout).toContain('commonjs:');
    });
});
