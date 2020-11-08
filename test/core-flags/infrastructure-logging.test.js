'use strict';

const { run } = require('../utils/test-utils');

describe('externals related flag', () => {
    it('should set infrastructureLogging.debug properly', () => {
        const { stdout, exitCode } = run(__dirname, ['--infrastructure-logging-debug', 'myPlugin']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(`debug: [ 'myPlugin' ]`);
    });

    it('should reset infrastructureLogging.debug to []', () => {
        const { stdout, exitCode } = run(__dirname, ['--infrastructure-logging-debug-reset']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(`debug: []`);
    });

    it('should set infrastructureLogging.level properly', () => {
        const { stdout, exitCode } = run(__dirname, ['--infrastructure-logging-level', 'log']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(`level: 'log'`);
    });
});
