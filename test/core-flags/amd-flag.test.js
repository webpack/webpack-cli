'use strict';

const { run } = require('../utils/test-utils');

describe('--no-amd flag', () => {
    it('should accept --no-amd', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--no-amd']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('amd: false');
    });
});
