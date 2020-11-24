const { run } = require('../utils/test-utils');

describe('unknown behaviour', () => {
    it('should log error if an unknown flag is passed in', () => {
        const { stderr, exitCode } = run(__dirname, ['--unknown']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown argument: '--unknown'");
    });

    it('should log error and respect --color flag', () => {
        const { stderr, exitCode } = run(__dirname, ['--unknown', '--color']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`[webpack-cli] \u001b[31mUnknown argument: '--unknown'`);
    });

    it('should log error for unknown flag and respect --no-color', () => {
        const { stderr, exitCode } = run(__dirname, ['--unknown', '--no-color']);

        expect(exitCode).toBe(2);
        expect(stderr).not.toContain(`[webpack-cli] \u001b[31mUnknown argument: '--unknown'`);
        expect(stderr).toContain("Unknown argument: '--unknown'");
    });

    it('suggests the closest match to an unknown flag', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--entyr', './a.js']);
        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown argument: '--entyr'");
        expect(stdout).toContain("Did you mean '--entry'?");
    });

    it('suggests the closest match to an unknown flag #2', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--output-fileneme', '[name].js']);
        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown argument: '--output-fileneme'");
        expect(stdout).toContain("Did you mean '--output-filename'?");
    });
});
