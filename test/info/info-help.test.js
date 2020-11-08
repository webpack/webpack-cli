'use strict';

const { yellow, options } = require('colorette');
const { runInfo } = require('../utils/test-utils');
const { commands } = require('../../packages/webpack-cli/lib/utils/cli-flags');

const infoFlags = commands.find((c) => c.name === 'info').flags;

const usageText = 'webpack i | info [options]';
const descriptionText = 'Outputs information about your system and dependencies';

describe('should print help for info command', () => {
    it('shows usage information on supplying help flag', () => {
        const { stdout, exitCode } = runInfo(['--help'], __dirname);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(usageText);
        expect(stdout).toContain(descriptionText);
    });

    it('should respect the --no-color flag', () => {
        const { stdout, exitCode } = runInfo(['--help', '--no-color'], __dirname);
        options.enabled = true;

        expect(exitCode).toBe(0);
        expect(stdout).not.toContain(yellow(usageText));
        expect(stdout).toContain(descriptionText);
    });

    it('should output all cli flags', () => {
        const { stdout, exitCode } = runInfo(['--help'], __dirname);

        infoFlags.forEach((flag) => expect(stdout).toContain(`--${flag.name}`));

        expect(exitCode).toBe(0);
    });
});
