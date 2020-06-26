'use strict';
// eslint-disable-next-line node/no-unpublished-require
const { run } = require('../../utils/test-utils');
// eslint-disable-next-line node/no-extraneous-require
const { version } = require('webpack');

const presets = ['normal', 'detailed', 'errors-only', 'errors-warnings', 'minimal', 'verbose', 'none'];

describe('stats flag', () => {
    for (const preset of presets) {
        it(`should accept --stats "${preset}"`, () => {
            const { stderr, stdout } = run(__dirname, ['--stats', `${preset}`]);
            expect(stderr).toBeFalsy();
            if (version.startsWith('5')) {
                expect(stdout).toContain(`stats: { preset: '${preset}' }`);
            } else {
                expect(stdout).toContain(`stats: '${preset}'`);
            }
        });
    }

    it('should accept stats as boolean', () => {
        const { stderr, stdout } = run(__dirname, ['--stats']);
        expect(stderr).toBeFalsy();
        if (version.startsWith('5')) {
            expect(stdout).toContain(`stats: {}`);
        } else {
            expect(stdout).toContain('stats: true');
        }
    });

    it('should warn when --verbose & --stats are passed together', () => {
        const { stderr, stdout } = run(__dirname, ['--verbose', '--stats', 'normal']);
        expect(stderr).toBeTruthy();
        expect(stderr).toContain('Conflict between "verbose" and "stats" options');
        expect(stdout).toBeTruthy();
    });

    it('should warn when an unknown flag stats value is passed', () => {
        const { stderr, stdout } = run(__dirname, ['--stats', 'foo']);
        expect(stderr).toBeTruthy();
        expect(stderr).toContain('invalid value for stats');
        expect(stdout).toBeTruthy();
    });
});
