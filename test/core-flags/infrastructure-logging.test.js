'use strict';

const { run } = require('../utils/test-utils');

describe('infrastructure logging related flag', () => {
    it('should set infrastructureLogging.debug properly', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--infrastructure-logging-debug', 'myPlugin']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`debug: [ 'myPlugin' ]`);
    });

    it('should reset infrastructureLogging.debug to []', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--infrastructure-logging-debug-reset']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`debug: []`);
    });

    it('should set infrastructureLogging.level properly', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--infrastructure-logging-level', 'log']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain(`level: 'log'`);
    });
});
