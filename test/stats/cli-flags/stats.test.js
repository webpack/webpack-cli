/* eslint-disable node/no-unpublished-require */
'use strict';

const { run, isWebpack5, isWindows } = require('../../utils/test-utils');

const presets = ['normal', 'detailed', 'errors-only', 'errors-warnings', 'minimal', 'verbose', 'none'];

if (isWebpack5) {
    presets.push('summary');
}

describe('stats flag', () => {
    for (const preset of presets) {
        it(`should accept --stats "${preset}"`, () => {
            const { stderr, stdout, exitCode } = run(__dirname, ['--stats', `${preset}`]);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            if (isWebpack5) {
                expect(stdout).toContain(`stats: { preset: '${preset}' }`);
            } else {
                expect(stdout).toContain(`stats: '${preset}'`);
            }
        });
    }

    it('should accept stats as boolean', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--stats']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        if (isWebpack5) {
            expect(stdout).toContain(`stats: { preset: 'normal' }`);
        } else {
            expect(stdout).toContain('stats: true');
        }
    });

    it('should warn when an unknown flag stats value is passed', () => {
        const { stderr, exitCode } = run(__dirname, ['--stats', 'foo']);

        expect(stderr).toBeTruthy();
        expect(stderr).toContain('* configuration.stats should be one of these:');
        if (isWebpack5) {
            expect(stderr).toContain(
                `"none" | "summary" | "errors-only" | "errors-warnings" | "minimal" | "normal" | "detailed" | "verbose"`,
            );
        } else {
            expect(stderr).toContain('"none" | "errors-only" | "minimal" | "normal" | "detailed" | "verbose" | "errors-warnings"');
        }
        // TODO - Fix exitcode check on windows
        if (!isWindows) {
            expect(exitCode).toEqual(2);
        }
    });
});
