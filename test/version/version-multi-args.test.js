'use strict';

const { run } = require('../utils/test-utils');
const pkgJSON = require('../../packages/webpack-cli/package.json');

describe('version flag with multiple arguments', () => {
    it('does not output version with help command', () => {
        const { stdout, exitCode } = run(__dirname, ['version', 'help'], false);

        expect(stdout).not.toContain(pkgJSON.version);
        expect(exitCode).toBe(0);

        const uniqueIdentifier = 'The build tool for modern web applications';
        expect(stdout).toContain(uniqueIdentifier);
    });

    it('does not output version with help dashed', () => {
        const { stdout, exitCode } = run(__dirname, ['version', '--help'], false);

        expect(stdout).not.toContain(pkgJSON.version);
        expect(exitCode).toBe(0);

        const uniqueIdentifier = 'The build tool for modern web applications';
        expect(stdout).toContain(uniqueIdentifier);
    });

    it('throws error if invalid command is passed with version command', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['version', 'abc'], false);

        expect(exitCode).toBe(2);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stderr).toContain(`Error: Invalid command 'abc'`);
        expect(stdout).toContain('Run webpack --help to see available commands and arguments');
    });

    it('throws error if invalid option is passed with version command', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['version', '--abc'], false);

        expect(exitCode).toBe(2);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stderr).toContain(`Error: Invalid option '--abc'`);
        expect(stdout).toContain('Run webpack --help to see available commands and arguments');
    });

    it('throws error if invalid command is passed with --version flag', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--version', 'abc'], false);

        expect(exitCode).toBe(2);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stderr).toContain(`Error: Invalid command 'abc'`);
        expect(stdout).toContain('Run webpack --help to see available commands and arguments');
    });

    it('throws error if invalid option is passed with --version flag', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--version', '--abc'], false);

        expect(exitCode).toBe(2);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stderr).toContain(`Error: Invalid option '--abc'`);
        expect(stdout).toContain('Run webpack --help to see available commands and arguments');
    });

    it('throws error if invalid command is passed with -v alias', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['-v', 'abc'], false);

        expect(exitCode).toBe(2);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stderr).toContain(`Error: Invalid command 'abc'`);
        expect(stdout).toContain('Run webpack --help to see available commands and arguments');
    });

    it('throws error if invalid option is passed with -v alias', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['-v', '--abc'], false);

        expect(exitCode).toBe(2);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stderr).toContain(`Error: Invalid option '--abc'`);
        expect(stdout).toContain('Run webpack --help to see available commands and arguments');
    });
});
