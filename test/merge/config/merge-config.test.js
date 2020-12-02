'use strict';

const { run } = require('../../utils/test-utils');

describe('merge flag configuration', () => {
    it('merges two configurations together', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--config', './1.js', '--config', './2.js', '--merge'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toContain('option has not been set, webpack will fallback to');
    });

    it('merges two configurations together with flag alias', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--config', './1.js', '--config', './2.js', '-m'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toContain('merged.js');
    });

    it('fails when there are less than 2 configurations to merge', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--config', './1.js', '-m'], false);

        expect(exitCode).toBe(2);
        expect(stderr).not.toContain('Compilation starting...');
        expect(stderr).not.toContain('Compilation finished');
        expect(stderr).toContain('At least two configurations are required for merge.');
        expect(stdout).toBeFalsy();
    });
});
