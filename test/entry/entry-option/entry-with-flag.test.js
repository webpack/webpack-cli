'use strict';

const { run, isWebpack5 } = require('../../utils/test-utils');
const { existsSync, readFile } = require('fs');
const { resolve } = require('path');

describe('"entry" option', () => {
    it('should work by default', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--mode', 'development']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work with the "--entry" option', (done) => {
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

    it('should work with the configuration value', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', './entry.config.js']);

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

    it('should work and override with the configuration value', (done) => {
        const options = ['-c', './entry.config.js'];

        if (isWebpack5) {
            options.push('--entry-reset');
        }

        options.push('--entry', './src/a.js');

        const { exitCode, stderr, stdout } = run(__dirname, options);

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

    it('should log error for non existing entry file', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--entry', './src/test.js']);

        expect(exitCode).toEqual(1);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("Module not found: Error: Can't resolve");
    });

    it('should allow multiple entry flags', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--entry', './src/a.js', '--entry', './src/b.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(existsSync(resolve(__dirname, './dist/main.js'))).toBeTruthy();

        readFile(resolve(__dirname, './dist/main.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toContain('Hello from a.js');
            expect(data).toContain('Hello from b.js');
            done();
        });
    });
});
