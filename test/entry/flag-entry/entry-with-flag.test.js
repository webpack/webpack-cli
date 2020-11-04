'use strict';

const { run, isWebpack5 } = require('../../utils/test-utils');
const { stat, readFile } = require('fs');
const { resolve } = require('path');

describe('entry flag', () => {
    it('should resolve the path to src/index.cjs', (done) => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--entry', './src/index.cjs', '-o', './dist/'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, './dist/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
        readFile(resolve(__dirname, './dist/main.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toContain('Kazuya Miyuki');
            done();
        });
    });

    it('should load ./src/a.js as entry', (done) => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--entry', './src/a.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
        readFile(resolve(__dirname, './bin/main.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toContain('Hello from a.js');
            done();
        });
    });

    it('should resolve the path to /src/a.js as ./src/a.js for webpack-5 only', (done) => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--entry', '/src/a.js']);

        if (isWebpack5) {
            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toBeTruthy();

            stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
                expect(err).toBe(null);
                expect(stats.isFile()).toBe(true);
                done();
            });
            readFile(resolve(__dirname, './bin/main.js'), 'utf-8', (err, data) => {
                expect(err).toBe(null);
                expect(data).toContain('Hello from a.js');
                done();
            });
        } else {
            expect(exitCode).toBe(1);
            expect(stdout).toContain(`Module not found: Error: Can't resolve`);
        }
    });

    it('should throw error for invalid entry file', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--entry', './src/test.js']);
        expect(stdout).toContain("Module not found: Error: Can't resolve");
        expect(exitCode).toEqual(1);
        expect(stderr).toBeFalsy();
    });
});
