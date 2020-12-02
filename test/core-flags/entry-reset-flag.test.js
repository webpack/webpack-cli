'use strict';

const { run } = require('../utils/test-utils');

describe('--entry-reset flag', () => {
    it('should reset entry correctly', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--entry-reset', '--entry', './src/entry.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain('src/entry.js');
        expect(stdout).not.toContain('src/main.js');
    });

    it('should throw error if entry is an empty array', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--entry-reset']);

        expect(exitCode).toBe(2);
        expect(stderr).not.toContain("Compilation 'compiler' starting...");
        expect(stderr).not.toContain("Compilation 'compiler' finished");
        expect(stderr).toContain('Invalid configuration object');
        expect(stdout).toBeFalsy();
    });
});
