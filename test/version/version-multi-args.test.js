'use strict';

const { run } = require('../utils/test-utils');
const pkgJSON = require('../../packages/webpack-cli/package.json');

describe('version flag with multiple arguments', () => {
    it('does not output version with help command', () => {
        const { stdout, stderr } = run(__dirname, ['version', 'help'], false);
        expect(stdout).not.toContain(pkgJSON.version);

        const uniqueIdentifier = '⬡                     webpack                     ⬡';
        expect(stdout).toContain(uniqueIdentifier);
        expect(stderr).toHaveLength(0);
    });

    it('does not output version with help dashed', () => {
        const { stdout, stderr } = run(__dirname, ['version', '--help'], false);
        expect(stdout).not.toContain(pkgJSON.version);

        const uniqueIdentifier = '⬡                     webpack                     ⬡';
        expect(stdout).toContain(uniqueIdentifier);
        expect(stderr).toHaveLength(0);
    });

    it('throws error if invalid command is passed with version command', () => {
        const { stdout, stderr } = run(__dirname, ['version', 'abc'], false);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stderr).toContain(`Error: Invalid command 'abc'`);
        expect(stdout).toContain('Run webpack --help to see available commands and arguments');
    });

    it('throws error if invalid option is passed with version command', () => {
        const { stdout, stderr } = run(__dirname, ['version', '--abc'], false);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stderr).toContain(`Error: Invalid option '--abc'`);
        expect(stdout).toContain('Run webpack --help to see available commands and arguments');
    });

    it('throws error if invalid command is passed with --version flag', () => {
        const { stdout, stderr } = run(__dirname, ['--version', 'abc'], false);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stderr).toContain(`Error: Invalid command 'abc'`);
        expect(stdout).toContain('Run webpack --help to see available commands and arguments');
    });

    it('throws error if invalid option is passed with --version flag', () => {
        const { stdout, stderr } = run(__dirname, ['--version', '--abc'], false);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stderr).toContain(`Error: Invalid option '--abc'`);
        expect(stdout).toContain('Run webpack --help to see available commands and arguments');
    });

    it('throws error if invalid command is passed with -v alias', () => {
        const { stdout, stderr } = run(__dirname, ['-v', 'abc'], false);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stderr).toContain(`Error: Invalid command 'abc'`);
        expect(stdout).toContain('Run webpack --help to see available commands and arguments');
    });

    it('throws error if invalid option is passed with -v alias', () => {
        const { stdout, stderr } = run(__dirname, ['-v', '--abc'], false);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stderr).toContain(`Error: Invalid option '--abc'`);
        expect(stdout).toContain('Run webpack --help to see available commands and arguments');
    });
});
