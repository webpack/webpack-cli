'use strict';

const { run } = require('../../utils/test-utils');
const { version } = require('webpack');

describe('stats flag', () => {
    it(`should use stats 'detailed' as defined in webpack config`, () => {
        const { stderr, stdout } = run(__dirname, []);

        expect(stderr).toBeFalsy();
        if (version.startsWith('5')) {
            expect(stdout).toContain(`stats: { preset: 'detailed' }`);
        } else {
            expect(stdout).toContain(`stats: 'detailed'`);
        }
    });

    it(`should use --no-stats and override value in config`, () => {
        const { stderr, stdout } = run(__dirname, ['--no-stats']);

        expect(stderr).toBeFalsy();
        if (version.startsWith('5')) {
            expect(stdout).toContain(`stats: { preset: 'none' }`);
        } else {
            expect(stdout).toContain(`stats: false`);
        }
    });
});
