'use strict';
// eslint-disable-next-line node/no-unpublished-require
const { run } = require('../utils/test-utils');

describe('stats flag', () => {
    // {
    //     StatsGroup.validOptions().map(option => {
    it('should accept stats "none"', () => {
        const { stderr, stdout } = run(__dirname, ['--stats', 'none']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeFalsy();
    });

    it('should accept stats "errors-only"', () => {
        const { stderr, stdout } = run(__dirname, ['--stats', 'errors-only']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeFalsy();
    });

    it('should accept stats "errors-warnings"', () => {
        const { stderr, stdout } = run(__dirname, ['--stats', 'errors-warnings']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeFalsy();
    });

    it('should accept stats "normal"', () => {
        const { stderr, stdout } = run(__dirname, ['--stats', 'normal']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should accept stats "verbose"', () => {
        const { stderr, stdout } = run(__dirname, ['--stats', 'verbose']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should accept stats "minimal"', () => {
        const { stderr, stdout } = run(__dirname, ['--stats', 'minimal']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should accept stats "detailed"', () => {
        const { stderr, stdout } = run(__dirname, ['--stats', 'detailed']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should warn when an unknown flag stats value is passed', () => {
        const { stderr, stdout } = run(__dirname, ['--stats', 'foo']);
        expect(stderr).toBeTruthy();
        expect(stderr).toContain('No value recognised for "stats" option');
        expect(stdout).toBeTruthy();
    });
});
