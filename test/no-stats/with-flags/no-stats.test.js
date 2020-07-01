'use strict';
// eslint-disable-next-line node/no-unpublished-require
const { run } = require('../../utils/test-utils');
// eslint-disable-next-line node/no-extraneous-require
const { version } = require('webpack');

describe('stats flag', () => {
    it('should accept --no-stats as boolean', () => {
        const { stderr, stdout } = run(__dirname, ['--no-stats']);

        expect(stderr).toBeFalsy();
        if (version.startsWith('5')) {
            expect(stdout).toContain(`stats: { preset: 'none' }`);
        } else {
            expect(stdout).toContain('stats: false');
        }
    });

    it('should warn and use --no-stats when stats and no-stats both are provided', () => {
        const { stderr, stdout } = run(__dirname, ['--stats', 'verbose', '--no-stats']);

        expect(stderr).toContain(`You provided both --stats and --no-stats. We will use only the last of these flags`);
        if (version.startsWith('5')) {
            expect(stdout).toContain(`stats: { preset: 'none' }`);
        } else {
            expect(stdout).toContain('stats: false');
        }
    });

    it('should warn and use --stats when stats and no-stats both are provided', () => {
        const { stderr, stdout } = run(__dirname, ['--no-stats', '--stats', 'verbose']);

        expect(stderr).toContain(`You provided both --stats and --no-stats. We will use only the last of these flags`);
        if (version.startsWith('5')) {
            expect(stdout).toContain(`stats: { preset: 'verbose' }`);
        } else {
            expect(stdout).toContain(`stats: 'verbose'`);
        }
    });

    it('should use --verbose over --no-stats', () => {
        const { stderr, stdout } = run(__dirname, ['--no-stats', '--verbose']);

        expect(stderr).toBeFalsy();
        if (version.startsWith('5')) {
            expect(stdout).toContain(`stats: { preset: 'verbose' }`);
        } else {
            expect(stdout).toContain(`stats: 'verbose'`);
        }
    });
});
