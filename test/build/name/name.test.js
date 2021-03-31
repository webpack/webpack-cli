'use strict';
const { runAsync } = require('../../utils/test-utils');

describe('name flag', () => {
    it('should set the flag in the config', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--name', 'config-name'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("name: 'config-name'");
    });
});
