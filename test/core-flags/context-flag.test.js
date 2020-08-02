'use strict';

const { run } = require('../utils/test-utils');

describe('--context flag', () => {
    it('should allow to set context', () => {
        const { stderr, stdout } = run(__dirname, ['--context', '/test-context-path']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('test-context-path');
    });
});
