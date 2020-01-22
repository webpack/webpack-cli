'use strict';

const { run } = require('../utils/test-utils');
const helpHeader = 'The build tool for modern web applications';

describe('commands help', () => {
    it('shows default help with invalid flag', () => {
        const { stdout, stderr } = run(__dirname, ['--help', '--my-flag'], false);
        expect(stdout).toContain(helpHeader);
        expect(stderr).toHaveLength(0);
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
});
