'use strict';

const { resolve } = require('path');
const { existsSync } = require('fs');
const { run } = require('../../utils/test-utils');

describe('functional config', () => {
    it('should work as expected in case of single config', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--config', resolve(__dirname, 'single-webpack.config.js')]);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'single' starting...");
        expect(stderr).toContain("Compilation 'single' finished");
        expect(stdout).toContain('./src/index.js');
        expect(existsSync(resolve(__dirname, './bin/dist-single.js'))).toBeTruthy();
    });

    it('should work as expected in case of multiple config', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--config', resolve(__dirname, 'multi-webpack.config.js')]);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'first' starting...");
        expect(stderr).toContain("Compilation 'first' finished");
        expect(stderr).toContain("Compilation 'second' starting...");
        expect(stderr).toContain("Compilation 'second' finished");
        expect(stdout).toContain('first');
        expect(stdout).toContain('second');
        expect(existsSync(resolve(__dirname, './bin/dist-first.js'))).toBeTruthy();
        expect(existsSync(resolve(__dirname, './bin/dist-second.js'))).toBeTruthy();
    });
});
