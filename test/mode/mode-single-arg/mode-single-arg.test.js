'use strict';
const { run } = require('../../utils/test-utils');
const { stat, readFile } = require('fs');
const { resolve } = require('path');
describe('mode flags', () => {
    it('should load a development config when --mode=development is passed', (done) => {
        const { stderr, stdout } = run(__dirname, ['--mode', 'development']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should load a production config when --mode=production is passed', (done) => {
        const { stderr, stdout } = run(__dirname, ['--mode', 'production']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should load a none config when --mode=none is passed', (done) => {
        const { stderr, stdout } = run(__dirname, ['--mode', 'none']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should show warning and load a production config when --mode=abcd is passed', (done) => {
        const { stderr, stdout } = run(__dirname, ['--mode', 'abcd']);
        expect(stderr).toContain('invalid value for "mode" option. Using "production" by default');
        expect(stdout).toBeTruthy();
        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
        readFile(resolve(__dirname, './bin/main.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toContain('production test');
            done();
        });
    });
});
