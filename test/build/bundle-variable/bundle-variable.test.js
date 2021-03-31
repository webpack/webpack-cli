'use strict';

const { runAsync } = require('../../utils/test-utils');

describe('bundle variable', () => {
    it('compiles without flags and export variable', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, [], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('PASS');
    });
});
