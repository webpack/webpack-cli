'use strict';

const chalk = require('chalk');
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
        chalk.enabled = true;
        chalk.level = 3;
        const orange = chalk.keyword('orange');
        expect(stdout).not.toContain(orange(usageText));
        expect(stdout).toContain(descriptionText);
        expect(stderr).toHaveLength(0);
    });

    it('should output all cli flags', () => {
        const { stdout, stderr } = runInfo(['help'], __dirname);
        infoFlags.forEach((flag) => expect(stdout).toContain(`--${flag.name}`));
        expect(stderr).toHaveLength(0);
    });
});
