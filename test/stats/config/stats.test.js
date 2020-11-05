/* eslint-disable node/no-extraneous-require */
'use strict';
// eslint-disable-next-line node/no-unpublished-require
const { run } = require('../../utils/test-utils');
const { version } = require('webpack');

describe('stats flag with config', () => {
    it('should compile without stats flag', () => {
        const { stderr, stdout, exitCode } = run(__dirname, []);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        if (version.startsWith('5')) {
            expect(stdout).toContain(`stats: { preset: 'normal' }`);
        } else {
            expect(stdout).toContain(`stats: 'normal'`);
        }
    });
    it('should compile with stats flag', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--stats', 'errors-warnings']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        if (version.startsWith('5')) {
            expect(stdout).toContain(`stats: { preset: 'errors-warnings' }`);
        } else {
            expect(stdout).toContain(`stats: 'errors-warnings'`);
        }
    });
});
