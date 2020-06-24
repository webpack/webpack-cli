'use strict';

const { run } = require('../utils/test-utils');
const helpHeader = 'The build tool for modern web applications';

describe('commands help', () => {
    it('throws error for invalid command with --help flag', () => {
        const { stderr } = run(__dirname, ['--help', 'myCommand'], false);
        expect(stderr).toContain(`You provided an invalid command 'myCommand'`);
    });

    it('throws error for invalid command with help command', () => {
        const { stderr } = run(__dirname, ['help', 'myCommand'], false);
        expect(stderr).toContain(`You provided an invalid command 'myCommand'`);
    });

    it('gives precedence to earlier command in case of multiple commands', () => {
        const { stdout, stderr } = run(__dirname, ['--help', 'init', 'info'], false);
        expect(stdout).not.toContain(helpHeader);
        expect(stdout).toContain('webpack c | init [scaffold]');
        expect(stderr).toHaveLength(0);
    });
});
