'use strict';

const { run } = require('../../utils/test-utils');
const { stat, readFile } = require('fs');
const { resolve } = require('path');

describe('entry flag', () => {
    it('should load ./src/a.js as entry', (done) => {
        const { stderr, stdout } = run(__dirname, ['--entry', './src/a.js']);
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

    it('should throw error for invalid entry file', () => {
        const { stderr, stdout } = run(__dirname, ['--entry', './src/test.js']);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('not found');
    });
});
