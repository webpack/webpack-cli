'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('function configuration', () => {
    it('is able to understand a configuration file as a function', () => {
        const { stdout, exitCode } = run(__dirname, ['--mode', 'development'], false);

        expect(exitCode).toBe(0);
        expect(stdout).toContain("argv: { color: true, mode: 'development' }");
        // Should generate the appropriate files
        expect(existsSync(resolve(__dirname, './dist/dev.js'))).toBeTruthy();
    });
});
