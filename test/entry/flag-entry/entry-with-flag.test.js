'use strict';

const { run } = require('../../utils/test-utils');
const { existsSync, readFile } = require('fs');
const { resolve } = require('path');

describe('entry flag', () => {
    it('should resolve the path to src/index.cjs', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--entry', './src/index.cjs', '-o', './dist/']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should load ./src/a.js as entry', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--entry', './src/a.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should resolve the path to /src/a.js as ./src/a.js', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--entry', '/src/a.js']);
        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(existsSync(resolve(__dirname, './dist/main.js'))).toBeTruthy();
        readFile(resolve(__dirname, './dist/main.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toContain('Hello from a.js');
            done();
        });
    });

    it('should throw error for invalid entry file', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--entry', './src/test.js']);

        expect(exitCode).toEqual(1);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("Module not found: Error: Can't resolve");
    });
});
