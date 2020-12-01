'use strict';

const { run } = require('../../utils/test-utils');
const { existsSync, readFile } = require('fs');
const { resolve } = require('path');

describe(' multiple entries', () => {
    it('should allow multiple entry files', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['./src/a.js', './src/b.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toBeTruthy();
        expect(existsSync(resolve(__dirname, './bin/main.js'))).toBeTruthy();
        readFile(resolve(__dirname, './bin/main.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toContain('Hello from a.js');
            expect(data).toContain('Hello from b.js');
            done();
        });
    });

    it('should allow multiple entry flags', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--entry', './src/a.js', '--entry', './src/b.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toBeTruthy();
        expect(existsSync(resolve(__dirname, './bin/main.js'))).toBeTruthy();

        readFile(resolve(__dirname, './bin/main.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toContain('Hello from a.js');
            expect(data).toContain('Hello from b.js');
            done();
        });
    });
});
