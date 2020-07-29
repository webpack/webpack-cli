'use strict';

const { run } = require('../utils/test-utils');

describe('externals related flag', () => {
    it('should set infrastructureLogging.debug properly', () => {
        const { stderr, stdout } = run(__dirname, ['--infrastructure-logging-debug', 'myPlugin']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`debug: [ 'myPlugin' ]`);
    });

    it('should reset infrastructureLogging.debug to []', () => {
        const { stderr, stdout } = run(__dirname, ['--infrastructure-logging-debug-reset']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`debug: []`);
    });

    it('should set infrastructureLogging.level properly', () => {
        const { stderr, stdout } = run(__dirname, ['--infrastructure-logging-level', 'log']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`level: 'log'`);
    });
});
