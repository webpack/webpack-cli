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

    it('should load a none config when --mode=production is passed before --no-mode', (done) => {
        const { stderr, stdout } = run(__dirname, ['--mode', 'production', '--no-mode']);
        expect(stderr).toContain(
            'You provided both --mode and --no-mode. We will use only the last of these flags that you provided in your CLI arguments',
        );
        expect(stdout).toBeTruthy();
        expect(stdout).not.toContain('main.js.map');

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should load a none config when --mode=production is passed after --no-mode', (done) => {
        const { stderr, stdout } = run(__dirname, ['--no-mode', '--mode', 'production']);
        expect(stderr).toContain(
            'You provided both --mode and --no-mode. We will use only the last of these flags that you provided in your CLI arguments',
        );
        expect(stdout).toBeTruthy();
        expect(stdout).toContain('main.js.map');

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
