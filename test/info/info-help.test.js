'use strict';

const chalk = require('chalk');
const { run } = require('../utils/test-utils');

const usageText = 'webpack info [options] [output-format]';
const descriptionText = 'Outputs information about your system and dependencies';

describe('should print help for info command', () => {
    it('help flag supplied after info', () => {
        const { stdout, stderr } = run(__dirname, ['info', 'help']);
        expect(stdout).toContain(usageText);
        expect(stdout).toContain(descriptionText);
        expect(stderr).toHaveLength(0);
    });

    it('dashed help flag supplied before info', () => {
        const { stdout, stderr } = run(__dirname, ['--help', 'info']);
        expect(stdout).toContain(usageText);
        expect(stdout).toContain(descriptionText);
        expect(stderr).toHaveLength(0);
    });

    it('should respect the --color flag', () => {
        const { stdout, stderr } = run(__dirname, ['info', 'help', '--color=true']);
        chalk.enabled = true;
        chalk.level = 3;
        const orange = chalk.keyword('orange');
        expect(stdout).toContain(orange(usageText));
        expect(stdout).toContain(descriptionText);
        expect(stderr).toHaveLength(0);
    });
});
