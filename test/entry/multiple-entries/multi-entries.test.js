'use strict';

const { run } = require('../../utils/test-utils');
const { stat, readFile } = require('fs');
const { resolve } = require('path');

describe(' multiple entries', () => {
    it('should allow multiple entry files', (done) => {
        const { exitCode } = run(__dirname, ['./src/a.js', './src/b.js']);

        expect(exitCode).toBe(0);

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
        readFile(resolve(__dirname, './bin/main.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toContain('Hello from a.js');
            expect(data).toContain('Hello from b.js');
            done();
        });
    });

    it('should allow multiple entry flags', (done) => {
        const { exitCode } = run(__dirname, ['--entry', './src/a.js', '--entry', './src/b.js']);

        expect(exitCode).toBe(0);

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
        readFile(resolve(__dirname, './bin/main.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toContain('Hello from a.js');
            expect(data).toContain('Hello from b.js');
            done();
        });
    });
});
