'use strict';

const { run } = require('../utils/test-utils');
const pkgJSON = require('../../packages/webpack-cli/package.json');

describe('version flag with multiple arguments', () => {
    it('does not output version with help command', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['version', 'help'], false);

        expect(exitCode).toBe(0);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stdout).toContain('The build tool for modern web applications');
        expect(stderr).toHaveLength(0);
    });

    it('does not output version with help dashed', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['version', '--help'], false);

        expect(exitCode).toBe(0);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stdout).toContain('The build tool for modern web applications');
        expect(stderr).toHaveLength(0);
    });

    it('throws error if invalid command is passed with version command', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['version', 'abc'], false);

        expect(exitCode).toBe(2);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stderr).toContain(`[webpack-cli] Invalid command 'abc'`);
        expect(stderr).toContain('[webpack-cli] Run webpack --help to see available commands and arguments');
    });

    it('throws error if invalid option is passed with version command', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['version', '--abc'], false);

        expect(exitCode).toBe(2);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stderr).toContain(`[webpack-cli] Invalid option '--abc'`);
        expect(stderr).toContain('[webpack-cli] Run webpack --help to see available commands and arguments');
    });

    it('throws error if invalid command is passed with --version flag', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--version', 'abc'], false);

        expect(exitCode).toBe(2);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stderr).toContain(`[webpack-cli] Invalid command 'abc'`);
        expect(stderr).toContain('[webpack-cli] Run webpack --help to see available commands and arguments');
    });

    it('throws error if invalid option is passed with --version flag', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--version', '--abc'], false);

        expect(exitCode).toBe(2);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stderr).toContain(`[webpack-cli] Invalid option '--abc'`);
        expect(stderr).toContain('[webpack-cli] Run webpack --help to see available commands and arguments');
    });

    it('throws error if invalid command is passed with -v alias', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['-v', 'abc'], false);

        expect(exitCode).toBe(2);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stderr).toContain(`[webpack-cli] Invalid command 'abc'`);
        expect(stderr).toContain('[webpack-cli] Run webpack --help to see available commands and arguments');
    });

    it('throws error if invalid option is passed with -v alias', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['-v', '--abc'], false);

        expect(exitCode).toBe(2);
        expect(stdout).not.toContain(pkgJSON.version);
        expect(stderr).toContain(`[webpack-cli] Invalid option '--abc'`);
        expect(stderr).toContain('[webpack-cli] Run webpack --help to see available commands and arguments');
    });
});
