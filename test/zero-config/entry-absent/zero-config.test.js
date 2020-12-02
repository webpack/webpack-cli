const { run } = require('../../utils/test-utils');

describe('Zero Config tests', () => {
    it('runs when config and entry are both absent', () => {
        const { exitCode, stderr, stdout } = run(__dirname, [], false);

        expect(exitCode).toBe(1);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        // Entry file is absent, should log the Error from the compiler
        expect(stdout).toContain("Error: Can't resolve './src'");
    });
});
