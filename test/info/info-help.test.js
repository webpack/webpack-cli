'use strict';

const { green } = require('colorette');
const { runInfo } = require('../utils/test-utils');
const { commands } = require('../../packages/webpack-cli/lib/utils/cli-flags');

const infoFlags = commands.find((c) => c.name === 'info').flags;

const usageText = 'webpack i | info [options]';
const descriptionText = 'Outputs information about your system and dependencies';

describe('should print help for info command', () => {
    it('shows usage information on supplying help flag', () => {
        const { stdout, stderr, exitCode } = runInfo(['--help'], __dirname);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(usageText);
        expect(stdout).toContain(descriptionText);
        expect(stderr).toHaveLength(0);
    });

    it('should work and respect the --no-color flag', () => {
        const { stdout, stderr, exitCode } = runInfo(['--help', '--no-color'], __dirname);

        expect(exitCode).toBe(0);
        expect(stdout).not.toContain(green(usageText));
        expect(stdout).toContain(descriptionText);
        expect(stderr).toHaveLength(0);
    });

    it('should output all cli flags', () => {
        const { stdout, stderr, exitCode } = runInfo(['--help'], __dirname);

        infoFlags.forEach((flag) => expect(stdout).toContain(`--${flag.name}`));
        expect(stderr).toHaveLength(0);
        expect(exitCode).toBe(0);
    });
});
