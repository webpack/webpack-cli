/* eslint-disable node/no-unpublished-require */
'use strict';

const { run, isWebpack5 } = require('../../utils/test-utils');

const presets = ['normal', 'detailed', 'errors-only', 'errors-warnings', 'minimal', 'verbose', 'none'];

if (isWebpack5) {
    presets.push('summary');
}

describe('stats flag', () => {
    for (const preset of presets) {
        it(`should accept --stats "${preset}"`, () => {
            const { exitCode, stderr, stdout } = run(__dirname, ['--stats', `${preset}`]);

            expect(exitCode).toBe(0);
            expect(stderr).toContain('Compilation starting...');
            expect(stderr).toContain('Compilation finished');

            if (isWebpack5) {
                expect(stdout).toContain(`stats: { preset: '${preset}' }`);
            } else {
                expect(stdout).toContain(`stats: '${preset}'`);
            }
        });
    }

    it('should accept stats as boolean', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--stats']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');

        if (isWebpack5) {
            expect(stdout).toContain(`stats: { preset: 'normal' }`);
        } else {
            expect(stdout).toContain('stats: true');
        }
    });

    it('should log error when an unknown flag stats value is passed', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--stats', 'foo']);

        expect(exitCode).toEqual(2);

        if (isWebpack5) {
            expect(stderr).toContain("Found the 'invalid-value' problem with the '--stats' argument by path 'stats'");
        }

        expect(stderr).toContain('Invalid configuration object');
        expect(stdout).toBeFalsy();
    });
});
