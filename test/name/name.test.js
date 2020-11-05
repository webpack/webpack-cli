'use strict';
const { run } = require('../utils/test-utils');

describe('name flag', () => {
    it('should set the flag in the config', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--name', 'config-name'], false);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).toContain("name: 'config-name'");
    });
});
