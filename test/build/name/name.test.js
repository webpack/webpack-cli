'use strict';
const { run } = require('../../utils/test-utils');

describe('name flag', () => {
    it('should set the flag in the config', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--name', 'config-name'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("name: 'config-name'");
    });
});
