'use strict';

const { run } = require('../../utils/test-utils');

describe('bundle command', () => {
    it('should work', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['bundle'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });
});
