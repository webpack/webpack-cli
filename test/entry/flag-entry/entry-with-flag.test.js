'use strict';

const { run, isWebpack5 } = require('../../utils/test-utils');
const { existsSync, readFile } = require('fs');
const { resolve } = require('path');

describe('entry flag', () => {
    it('should resolve the path to src/index.cjs', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--entry', './src/index.cjs', '-o', './dist/'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toBeTruthy();
    });

    it('should load ./src/a.js as entry', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--entry', './src/a.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toBeTruthy();
    });

    it('should resolve the path to /src/a.js as ./src/a.js for webpack-5 only', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--entry', '/src/a.js']);

        if (!isWebpack5) {
            expect(exitCode).toBe(1);
            expect(stderr).toContain('Compilation starting...');
            expect(stderr).toContain('Compilation finished');
            expect(stdout).toContain(`Module not found: Error: Can't resolve`);
            done();
        } else {
            expect(exitCode).toBe(0);
            expect(stderr).toContain('Compilation starting...');
            expect(stderr).toContain('Compilation finished');
            expect(stdout).toBeTruthy();
            expect(existsSync(resolve(__dirname, './dist/main.js'))).toBeTruthy();
            readFile(resolve(__dirname, './bin/main.js'), 'utf-8', (err, data) => {
                expect(err).toBe(null);
                expect(data).toContain('Hello from a.js');
                done();
            });
        }
    });

    it('should throw error for invalid entry file', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--entry', './src/test.js']);

        expect(exitCode).toEqual(1);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toContain("Module not found: Error: Can't resolve");
    });
});
