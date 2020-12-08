'use strict';

const { green } = require('colorette');
const { runInfo } = require('../utils/test-utils');
const { commands } = require('../../packages/webpack-cli/lib/utils/cli-flags');

const infoFlags = commands.find((c) => c.name === 'info').flags;

const usageText = 'webpack i | info [options]';
const descriptionText = 'Outputs information about your system and dependencies';

describe('should print help for info command', () => {
    it('shows usage information on supplying help flag', () => {
        const { exitCode, stderr, stdout } = runInfo(['--help'], __dirname);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(usageText);
        expect(stdout).toContain(descriptionText);
    });

    it('should work and respect the --no-color flag', () => {
        const { exitCode, stderr, stdout } = runInfo(['--help', '--no-color'], __dirname);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toContain(green(usageText));
        expect(stdout).toContain(descriptionText);
    });

    it('should work and respect the --color flag', () => {
        const { exitCode, stderr, stdout } = runInfo(['--help', '--color'], __dirname);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(green(usageText));
        expect(stdout).toContain(descriptionText);
    });

    it('should output all cli flags', () => {
        const { exitCode, stderr, stdout } = runInfo(['--help'], __dirname);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();

        infoFlags.forEach((flag) => expect(stdout).toContain(`--${flag.name}`));
    });
});
