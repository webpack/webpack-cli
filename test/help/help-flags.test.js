'use strict';

const { run } = require('../utils/test-utils');
const helpHeader = 'The build tool for modern web applications';

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
        expect(stdout).toContain('webpack -m, --merge');
        expect(stderr).toHaveLength(0);
    });

    it('gives precedence to earlier flag in case of multiple flags', () => {
        const { stdout, stderr } = run(__dirname, ['--help', '--entry', '--merge'], false);
        expect(stdout).not.toContain(helpHeader);
        expect(stdout).toContain('webpack --entry <path to entry file>');
        expect(stderr).toHaveLength(0);
    });
});
