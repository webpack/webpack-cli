'use strict';

const { run } = require('../../utils/test-utils');

describe("'configtest' command without the configuration path option", () => {
    it.only('should validate default configuration', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['configtest'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('No configuration found.');
        expect(stdout).toBeFalsy();
    });
});
