'use strict';

const { runAsync, isWebpack5 } = require('../../../utils/test-utils');

describe('stats flag', () => {
    it(`should use stats 'detailed' as defined in webpack config`, async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, []);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();

        if (isWebpack5) {
            expect(stdout).toContain("preset: 'detailed'");
        } else {
            expect(stdout).toContain('entrypoints: true');
            expect(stdout).toContain('logging: true');
            expect(stdout).toContain('maxModules: Infinity');
        }
    });

    it(`should use --no-stats and override value in config`, async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--no-stats']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();

        if (isWebpack5) {
            expect(stdout).toContain("preset: 'none'");
        } else {
            expect(stdout).toContain('all: false');
        }
    });
});
