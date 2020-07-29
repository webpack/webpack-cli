'use strict';

const { run } = require('../utils/test-utils');

describe('--no-amd flag', () => {
    it('should accept --no-amd', () => {
        const { stderr, stdout } = run(__dirname, ['--no-amd']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('amd: false');
    });
});
