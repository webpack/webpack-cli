'use strict';

const { run } = require('../utils/test-utils');
const { stat } = require('fs');
const { resolve } = require('path');

describe('--config-name flag', () => {
    it('should select only the config whose name is passed with --config-name', (done) => {
        const { stderr, stdout } = run(__dirname, ['--config-name', 'first'], false);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('Child first');
        expect(stdout).not.toContain('Child second');
        expect(stdout).not.toContain('Child third');

        stat(resolve(__dirname, './dist/dist-first.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should work with multiple values for --config-name', (done) => {
        const { stderr, stdout } = run(__dirname, ['--config-name', 'first', '--config-name', 'third'], false);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('Child first');
        expect(stdout).not.toContain('Child second');
        expect(stdout).toContain('Child third');

        stat(resolve(__dirname, './dist/dist-first.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
        stat(resolve(__dirname, './dist/dist-third.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should log error if invalid config name is provided', () => {
        const { stderr, stdout } = run(__dirname, ['--config-name', 'test'], false);
        expect(stderr).toContain('Configuration with name "test" was not found.');
        expect(stdout).toBeFalsy();
    });
});
