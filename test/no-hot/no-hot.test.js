'use strict';
const { run } = require('../utils/test-utils');
const { stat, readFile } = require('fs');
const { resolve } = require('path');
const { yellow } = require('colorette');

describe('no-hot flag', () => {
    it('should be successful when --no-hot is passed', (done) => {
        const { stdout, exitCode } = run(__dirname, ['--no-hot']);

        expect(exitCode).toBe(0);

        expect(stdout).not.toContain('webpack/runtime/hot module replacement');

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
        readFile(resolve(__dirname, './bin/main.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            // check for absence of special functions invoked by HMR plugin only
            expect(data).not.toContain('/* webpack/runtime/hot module replacement */');
            done();
        });
    });

    it('should warn when --hot and --no-hot both are passed', (done) => {
        const { stderr, exitCode } = run(__dirname, ['--hot', '--no-hot']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain(
            `[webpack-cli] ${yellow(
                'You provided both --hot and --no-hot. We will use only the last of these flags that you provided in your CLI arguments',
            )}`,
        );

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
        readFile(resolve(__dirname, './bin/main.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            // check for absence of special functions invoked by HMR plugin only
            expect(data).not.toContain('/* webpack/runtime/hot module replacement */');
            done();
        });
    });
});
