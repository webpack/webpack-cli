const { run } = require('../utils/test-utils');

const unknownError = 'Unknown argument: --unknown';

describe('unknown behaviour', () => {
    it('throws error if an unknown flag is passed in', () => {
        const { stderr, exitCode } = run(__dirname, ['--unknown']);
        expect(stderr).toBeTruthy();
        expect(stderr).toContain('Unknown argument: --unknown');
        expect(stderr).toContain(unknownError);
        expect(exitCode).toBe(2);
    });

    it('should throw error and respect --color flag', () => {
        const { stderr, exitCode } = run(__dirname, ['--unknown', '--color']);
        expect(stderr).toBeTruthy();
        expect(stderr).toContain(`[webpack-cli] \u001b[31m${unknownError}`);
        expect(exitCode).toBe(2);
    });

    it('throws error for unknow flag and respect --no-color', () => {
        const { stderr, exitCode } = run(__dirname, ['--unknown', '--no-color']);
        expect(stderr).toBeTruthy();
        expect(stderr).not.toContain(`[webpack-cli] \u001b[31m${unknownError}`);
        expect(stderr).toContain(unknownError);
        expect(exitCode).toBe(2);
    });

    it('suggests the closest match to an unknown flag', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--entyr', './a.js']);
        expect(stderr).toContain('Unknown argument: --entyr');
        expect(stdout).toContain('Did you mean --entry?');
        expect(exitCode).toBe(2);
    });
});
