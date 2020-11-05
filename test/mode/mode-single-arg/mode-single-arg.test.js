'use strict';
const { run } = require('../../utils/test-utils');

describe('mode flags', () => {
    it('should set mode=production by default', () => {
        const { stderr, stdout, exitCode } = run(__dirname);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`mode: 'production'`);
    });

    it('should load a development config when --mode=development is passed', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--mode', 'development']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`mode: 'development'`);
    });

    it('should load a production config when --mode=production is passed', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--mode', 'production']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`mode: 'production'`);
    });

    it('should load a none config when --mode=none is passed', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--mode', 'none']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`mode: 'none'`);
    });

    it('should pick mode form NODE_ENV', () => {
        const { stderr, stdout, exitCode } = run(__dirname, [], false, [], { NODE_ENV: 'development' });

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`mode: 'development'`);
    });

    it('should throw error when --mode=abcd is passed', () => {
        const { stderr, exitCode } = run(__dirname, ['--mode', 'abcd']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('configuration.mode should be one of these');
        expect(stderr).toContain(`"development" | "production" | "none"`);
    });
});
