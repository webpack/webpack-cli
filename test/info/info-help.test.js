'use strict';

const { green } = require('colorette');
const { runInfo } = require('../utils/test-utils');

const usageText = 'webpack info|i [options]';

describe('should print help for info command', () => {
    it('shows usage information on supplying help flag', () => {
        const { exitCode, stderr, stdout } = runInfo(['--help'], __dirname);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(usageText);
    });

    it('should work and respect the --no-color flag', () => {
        const { exitCode, stderr, stdout } = runInfo(['--help', '--no-color'], __dirname);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toContain(green(usageText));
    });

    it('should work and respect the --color flag', () => {
        const { exitCode, stderr, stdout } = runInfo(['--help', '--color'], __dirname);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(green(usageText));
    });

    it('should output all cli flags', () => {
        const { exitCode, stderr, stdout } = runInfo(['--help'], __dirname);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`--output`);
    });
});
