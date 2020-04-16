'use strict';

const chalk = require('chalk');
const path = require('path');
const { run } = require('../utils/test-utils');
const { commands } = require('../../packages/webpack-cli/lib/utils/cli-flags');

const runInfo = (args) => {
    return run(path.resolve(__dirname), args, false);
};

const infoFlags = commands.find((c) => c.name === 'info').flags;

const usageText = 'webpack info [options]';
const descriptionText = 'Outputs information about your system and dependencies';

describe('should print help for info command', () => {
    it('help flag supplied after info', () => {
        const { stdout, stderr } = runInfo(['info', 'help']);
        expect(stdout).toContain(usageText);
        expect(stdout).toContain(descriptionText);
        expect(stderr).toHaveLength(0);
    });

    it('dashed help flag supplied before info', () => {
        const { stdout, stderr } = runInfo(['--help', 'info']);
        expect(stdout).toContain(usageText);
        expect(stdout).toContain(descriptionText);
        expect(stderr).toHaveLength(0);
    });

    it('should respect the --color=false flag', () => {
        const { stdout, stderr } = runInfo(['info', 'help', '--color=false']);
        chalk.enabled = true;
        chalk.level = 3;
        const orange = chalk.keyword('orange');
        expect(stdout).not.toContain(orange(usageText));
        expect(stdout).toContain(descriptionText);
        expect(stderr).toHaveLength(0);
    });

    it('should output all cli flags', () => {
        const { stdout, stderr } = runInfo(['info', 'help']);
        infoFlags.forEach((flag) => expect(stdout).toContain(`--${flag.name}`));
        expect(stderr).toHaveLength(0);
    });
});
