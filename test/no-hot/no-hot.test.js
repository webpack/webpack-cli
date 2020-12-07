'use strict';

const { run } = require('../utils/test-utils');
const { existsSync, readFile } = require('fs');
const { resolve } = require('path');

describe('no-hot flag', () => {
    it('should be successful when --no-hot is passed', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--no-hot']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toBeTruthy();
        expect(stdout).not.toContain('webpack/runtime/hot module replacement');
        expect(existsSync(resolve(__dirname, './dist/main.js'))).toBeTruthy();
        readFile(resolve(__dirname, './dist/main.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            // check for absence of special functions invoked by HMR plugin only
            expect(data).not.toContain('/* webpack/runtime/hot module replacement */');
            done();
        });
    });

    it('should warn when --hot and --no-hot both are passed', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--hot', '--no-hot']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stderr).toContain(
            'You provided both --hot and --no-hot. We will use only the last of these flags that you provided in your CLI arguments',
        );
        expect(stdout).toBeTruthy();

        expect(existsSync(resolve(__dirname, './dist/main.js'))).toBeTruthy();

        readFile(resolve(__dirname, './dist/main.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            // check for absence of special functions invoked by HMR plugin only
            expect(data).not.toContain('/* webpack/runtime/hot module replacement */');
            done();
        });
    });
});
