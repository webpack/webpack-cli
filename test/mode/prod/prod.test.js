'use strict';
const { run } = require('../../utils/test-utils');
const { stat, readFile } = require('fs');
const { resolve } = require('path');
describe('mode flags', () => {
    it('should load a production config when --prod is passed', (done) => {
        const { stderr, stdout } = run(__dirname, ['--prod']);
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

    it('should load a production config when --mode=abcd is passed', (done) => {
        const { stderr, stdout } = run(__dirname, ['--mode', 'abcd']);
        expect(stderr).toContain('invalid value for "mode"');
        expect(stdout).toBeTruthy();
        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
        readFile(resolve(__dirname, './bin/main.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toContain('production');
            done();
        });
    });

    it('should load a production config when --mode=production and --prod are passed', (done) => {
        const { stderr, stdout } = run(__dirname, ['--mode', 'production', '--prod']);
        expect(stderr).toContain('"mode" will be used');
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should load a production config when --mode=production and --dev are passed', (done) => {
        const { stderr, stdout } = run(__dirname, ['--mode', 'production', '--dev']);
        expect(stderr).toContain('"mode" will be used');
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should load a production config when passing --dev and --prod', (done) => {
        const { stderr, stdout } = run(__dirname, ['--prod', '--dev']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
