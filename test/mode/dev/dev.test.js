'use strict';
const { run } = require('../../utils/test-utils');
const { stat } = require('fs');
const { resolve } = require('path');
describe('mode flags', () => {
    it('should load a development config when --dev is passed', (done) => {
        const { stderr, stdout } = run(__dirname, ['--dev']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should load a development config when --mode=development and --dev are passed', (done) => {
        const { stderr, stdout } = run(__dirname, ['--mode', 'development', '--dev']);
        expect(stderr).toContain('"mode" will be used');
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should load a development config when --mode=development and --prod are passed', (done) => {
        const { stderr, stdout } = run(__dirname, ['--mode', 'development', '--prod']);
        expect(stderr).toContain('"mode" will be used');
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
