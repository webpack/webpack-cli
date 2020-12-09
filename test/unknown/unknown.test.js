const { run, isWebpack5 } = require('../utils/test-utils');

describe('unknown behaviour', () => {
    it('should log error if an unknown flag is passed in', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--unknown']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("unknown option '--unknown'");
        expect(stdout).toBeFalsy();
    });

    it('should log error and respect --color flag', () => {
        const { exitCode, stdout } = run(__dirname, ['--unknown', '--color']);

        expect(exitCode).toBe(2);
        // TODO need fix in future
        // expect(stderr).toContain(`[webpack-cli] \u001b[31mUnknown argument: '--unknown'`);
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown flag and respect --no-color', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--unknown', '--no-color']);

        expect(exitCode).toBe(2);
        expect(stderr).not.toContain(`[webpack-cli] \u001b[31munknown option '--unknown'`);
        expect(stderr).toContain("unknown option '--unknown'");
        expect(stdout).toBeFalsy();
    });

    it('suggests the closest match to an unknown flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--entyr', './a.js']);
        expect(exitCode).toBe(2);
        expect(stderr).toContain("unknown option '--entyr'");
        expect(stdout).toContain("Did you mean '--entry'?");
    });

    it('suggests the closest match to an unknown flag #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--output-fileneme', '[name].js']);
        expect(exitCode).toBe(2);
        expect(stderr).toContain("unknown option '--output-fileneme'");

        if (isWebpack5) {
            expect(stdout).toContain("Did you mean '--output-filename'?");
        }
    });
});
