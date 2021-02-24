'use strict';

const { run, isWebpack5 } = require('../../utils/test-utils');

describe('mode flags', () => {
    it('should not set mode=production by default', () => {
        const { exitCode, stderr, stdout } = run(__dirname);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toContain(`mode: 'production'`);
        expect(stdout).toContain(`The 'mode' option has not been set, webpack will fallback to 'production' for this value.`);
    });

    it('should load a development config when --mode=development is passed', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--mode', 'development']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`mode: 'development'`);
    });

    it('should load a production config when --mode=production is passed', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--mode', 'production']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`mode: 'production'`);
    });

    it('should load a none config when --mode=none is passed', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--mode', 'none']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`mode: 'none'`);
    });

    it('should pick mode form NODE_ENV', () => {
        const { exitCode, stderr, stdout } = run(__dirname, [], { env: { NODE_ENV: 'development' } });

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`mode: 'development'`);
    });

    it('should throw error when --mode=abcd is passed', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--mode', 'abcd']);

        expect(exitCode).toBe(2);

        if (isWebpack5) {
            expect(stderr).toContain("Invalid value 'abcd' for the '--mode' option");
            expect(stderr).toContain("Expected: 'development | production | none'");
        } else {
            expect(stderr).toContain('configuration.mode should be one of these');
            expect(stderr).toContain(`"development" | "production" | "none"`);
        }

        expect(stdout).toBeFalsy();
    });
});
