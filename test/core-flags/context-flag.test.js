'use strict';

const { resolve } = require('path');
const { run } = require('../utils/test-utils');

describe('--context flag', () => {
    it('should allow to set context', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--context', './']);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).toContain(`context: '${resolve(__dirname, './')}'`);
    });

    it('should throw module not found error for invalid context', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--context', '/test-context-path']);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(1);
        expect(stdout).toContain(`Module not found: Error: Can't resolve './src/main.js' in '/test-context-path'`);
    });
});
