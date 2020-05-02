'use strict';

const { run } = require('../utils/test-utils');
const helpHeader = 'The build tool for modern web applications';
const footer = 'Made with ♥️  by the webpack team';

describe('commands help', () => {
    it('throws error for invalid flag with --help flag', () => {
        const { stderr } = run(__dirname, ['--help', '--my-flag'], false);
        expect(stderr).toContain(`You provided an invalid option '--my-flag'`);
    });

    it('throws error for invalid flag with help command', () => {
        const { stderr } = run(__dirname, ['help', '--my-flag'], false);
        expect(stderr).toContain(`You provided an invalid option '--my-flag'`);
    });

    it('shows flag help with valid flag', () => {
        const { stdout, stderr } = run(__dirname, ['--help', '--merge'], false);
        expect(stdout).not.toContain(helpHeader);
        expect(stdout).toContain('webpack --merge <path to configuration to be merged> e.g. ./webpack.config.js');
        expect(stderr).toHaveLength(0);
    });

    it('gives precedence to earlier flag in case of multiple flags', () => {
        const { stdout, stderr } = run(__dirname, ['--help', '--entry', '--merge'], false);
        expect(stdout).not.toContain(helpHeader);
        expect(stdout).toContain('webpack --entry <path to entry file> e.g. ./src/main.js');
        expect(stderr).toHaveLength(0);
    });
    it('shows accepted value if available for a flag', () => {
        const { stdout, stderr } = run(__dirname, ['--help', '--stats'], false);
        expect(stdout).toContain(footer);
        expect(stdout).toContain('Accepted Value: none | errors-only | minimal | normal | detailed | verbose | errors-warnings');
        expect(stderr).toHaveLength(0);
    });
});
