'use strict';

const { run } = require('../utils/test-utils');

describe('--no-amd flag', () => {
    it('should accept --no-amd', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--no-amd']);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).toContain('amd: false');
    });
});
