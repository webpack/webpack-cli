'use strict';

const { yellow, options } = require('colorette');
const { runInfo } = require('../utils/test-utils');
const { commands } = require('../../packages/webpack-cli/lib/utils/cli-flags');

const infoFlags = commands.find((c) => c.name === 'info').flags;

const usageText = 'webpack i | info [options]';
const descriptionText = 'Outputs information about your system and dependencies';

describe('should print help for info command', () => {
    it('shows usage information on supplying help flag', () => {
        const { stdout, stderr } = runInfo(['help'], __dirname);
        expect(stdout).toContain(usageText);
        expect(stdout).toContain(descriptionText);
        expect(stderr).toHaveLength(0);
    });

    it('should respect the --color=false flag', () => {
        const { stdout, stderr } = runInfo(['help', '--color=false'], __dirname);
        //unusual behavior for windows CI
        if (process.platform !== 'win32') {
            options.enabled = true;
            expect(stdout).not.toContain(yellow(usageText));
        }
        expect(stdout).toContain(descriptionText);
        expect(stderr).toHaveLength(0);
    });

    it('should output all cli flags', () => {
        const { stdout, stderr } = runInfo(['help'], __dirname);
        infoFlags.forEach((flag) => expect(stdout).toContain(`--${flag.name}`));
        expect(stderr).toHaveLength(0);
    });
});
