'use strict';

const { runAsync } = require('../../utils/test-utils');

describe('--no-amd flag', () => {
    it('should accept --no-amd', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--no-amd']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('amd: false');
    });
});
