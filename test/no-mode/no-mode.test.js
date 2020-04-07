'use strict';
const { run } = require('../utils/test-utils');
const { stat } = require('fs');
const { resolve } = require('path');
describe('no-mode flag', () => {
    it('should load a none config when --no-mode is passed', (done) => {
        const { stderr, stdout } = run(__dirname, ['--no-mode']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should load a none config when --no-mode and --dev are passed', (done) => {
        const { stderr, stdout } = run(__dirname, ['--no-mode', '--dev']);
        expect(stderr).toContain('"no-mode" will be used');
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should load a none config when --no-mode and --prod are passed', (done) => {
        const { stderr, stdout } = run(__dirname, ['--no-mode', '--prod']);
        expect(stderr).toContain('"no-mode" will be used');
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should load a production config when --mode=production & --no-mode are passed', (done) => {
        const { stderr, stdout } = run(__dirname, ['--mode', 'production', '--no-mode']);
        expect(stderr).toContain('"mode" will be used');
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should load a development config when --mode=development and --no-mode are passed', (done) => {
        const { stderr, stdout } = run(__dirname, ['--mode', 'development', '--no-mode']);
        expect(stderr).toContain('"mode" will be used');
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
