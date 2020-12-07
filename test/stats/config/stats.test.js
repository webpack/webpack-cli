/* eslint-disable node/no-extraneous-require */
'use strict';
// eslint-disable-next-line node/no-unpublished-require
const { run, isWebpack5 } = require('../../utils/test-utils');
const { version } = require('webpack');

// 'normal' is used in webpack.config.js
const statsPresets = ['detailed', 'errors-only', 'errors-warnings', 'minimal', 'verbose', 'none'];

if (isWebpack5) {
    statsPresets.push('summary');
}

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

    for (const preset of statsPresets) {
        it(`should override 'noramal' value in config with "${preset}"`, () => {
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
});
