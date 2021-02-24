'use strict';

const fs = require('fs');
const { join } = require('path');
const { run } = require('../utils/test-utils');
const rimraf = require('rimraf');

describe('prefetch', () => {
    afterEach(() => {
        rimraf.sync(join(__dirname, 'dist'));
    });

    it('should load the prefetched file', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--prefetch', './src/p.js', '--mode', 'development'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        const content = fs.readFileSync(join(__dirname, '/dist/main.js'), 'utf-8');

        expect(content).not.toContain('// no prefetching');
    });

    it('should log error when the prefetched file is absent', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--prefetch', './src/somefile.js'], false);

        expect(exitCode).toBe(1);
        expect(stderr).toBeFalsy();
        // Should contain the error message
        expect(stdout).toContain(`Error: Can't resolve './src/somefile.js'`);
    });

    it('should log error when flag value is not supplied', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--prefetch'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`Error: Option '--prefetch <value>' argument missing`);
        expect(stdout).toBeFalsy();
    });
});
