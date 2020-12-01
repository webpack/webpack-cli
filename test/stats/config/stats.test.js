/* eslint-disable node/no-extraneous-require */
'use strict';
// eslint-disable-next-line node/no-unpublished-require
const { run } = require('../../utils/test-utils');
const { version } = require('webpack');

describe('stats flag with config', () => {
    it('should compile without stats flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, []);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');

        if (version.startsWith('5')) {
            expect(stdout).toContain(`stats: { preset: 'normal' }`);
        } else {
            expect(stdout).toContain(`stats: 'normal'`);
        }
    });
    it('should compile with stats flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--stats', 'errors-warnings']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');

        if (version.startsWith('5')) {
            expect(stdout).toContain(`stats: { preset: 'errors-warnings' }`);
        } else {
            expect(stdout).toContain(`stats: 'errors-warnings'`);
        }
    });
});
