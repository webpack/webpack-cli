'use strict';

const { resolve } = require('path');
const { run, isWindows } = require('../utils/test-utils');

describe('--context flag', () => {
    it('should allow to set context', () => {
        const { stdout, exitCode } = run(__dirname, ['--context', './']);

        expect(exitCode).toBe(0);
        if (isWindows) {
            const windowsPath = resolve(__dirname, './').replace(/\\/g, '\\\\');
            expect(stdout).toContain(`context: '${windowsPath}'`);
        } else {
            expect(stdout).toContain(`context: '${resolve(__dirname, './')}'`);
        }
    });

    it('should throw module not found error for invalid context', () => {
        const { stdout, exitCode } = run(__dirname, ['--context', '/invalid-context-path']);

        expect(exitCode).toBe(1);
        expect(stdout).toContain(`Module not found: Error: Can't resolve './src/main.js'`);
    });
});
