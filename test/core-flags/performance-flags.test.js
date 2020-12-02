'use strict';

const { run, hyphenToUpperCase } = require('../utils/test-utils');
const { flags } = require('../../packages/webpack-cli/lib/utils/cli-flags');

const performanceFlags = flags.filter(({ name }) => name.startsWith('performance-'));

describe('module config related flag', () => {
    it(`should config --performance option correctly`, () => {
        const { exitCode, stderr, stdout } = run(__dirname, [`--no-performance`]);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain('performance: false');
    });

    performanceFlags.forEach((flag) => {
        // extract property name from flag name
        const property = flag.name.split('performance-')[1];
        const propName = hyphenToUpperCase(property);

        if (flag.type === Number) {
            it(`should config --${flag.name} correctly`, () => {
                const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, '10']);

                expect(exitCode).toBe(0);
                expect(stderr).toContain("Compilation 'compiler' starting...");
                expect(stderr).toContain("Compilation 'compiler' finished");
                expect(stdout).toContain(`${propName}: 10`);
            });
        }

        if (flag.type === String) {
            it(`should config --${flag.name} correctly`, () => {
                const { exitCode, stderr, stdout } = run(__dirname, [`--${flag.name}`, 'warning']);

                expect(exitCode).toBe(0);
                expect(stderr).toContain("Compilation 'compiler' starting...");
                expect(stderr).toContain("Compilation 'compiler' finished");
                expect(stdout).toContain(`${propName}: 'warning'`);
            });
        }
    });
});
