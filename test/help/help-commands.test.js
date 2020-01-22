'use strict';

const { run } = require('../utils/test-utils');
const helpHeader = 'The build tool for modern web applications';

describe('commands help', () => {
    it('shows default help with invalid command', () => {
        const { stdout, stderr } = run(__dirname, ['--help', 'myCommand'], false);
        expect(stdout).toContain(helpHeader);
        expect(stderr).toHaveLength(0);
    });
    it('shows command help with valid command', () => {
        const { stdout, stderr } = run(__dirname, ['--help', 'create'], false);
        expect(stdout).not.toContain(helpHeader);
        expect(stdout).toContain('webpack create | create <scaffold>');
        expect(stderr).toHaveLength(0);
    });

    it('gives precedence to earlier command in case multiple commands', () => {
        const { stdout, stderr } = run(__dirname, ['--help', 'create', 'info'], false);
        expect(stdout).not.toContain(helpHeader);
        expect(stdout).toContain('webpack create | create <scaffold>');
        expect(stderr).toHaveLength(0);
    });
});
