'use strict';

const { run, isWebpack5 } = require('../utils/test-utils');

describe('unknown behaviour', () => {
    it('should log an error if an unknown flag is passed', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--unknown']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--unknown'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log an error if an unknown flag is passed #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-u']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '-u'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log an error if an unknown flag is passed #3', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-u', '--unknown']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '-u'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log an error if an unknown flag is passed #4', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-u', '-u']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '-u'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log an error if an unknown flag is passed #5', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-u', 'foo']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '-u'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log an error if an unknown flag is passed using "bundle" command', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['bundle', '--unknown']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--unknown'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log an error if an unknown flag is passed using "b" command', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['b', '--unknown']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--unknown'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log an error if an unknown flag is passed using "bundle" command #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--unknown', 'bundle']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--unknown'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log an error if an unknown flag is passed using "info" command', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['info', '--unknown']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--unknown'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log an error if an unknown flag is passed using "i" command', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['i', '--unknown']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--unknown'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log an error if an unknown flag is passed using "i" command', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--unknown', 'i']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--unknown'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error and respect --color flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--unknown', '--color']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--unknown'");
        expect(stderr).toContain("\u001b[31mRun 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown flag and respect --no-color', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--unknown', '--no-color']);

        expect(exitCode).toBe(2);
        expect(stderr).not.toContain(`\u001b[31mError: Unknown option '--unknown'`);
        expect(stderr).not.toContain("\u001b[31mRun 'webpack --help' to see available commands and options");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log an error if an unknown flag is passed and suggests the closest match to an unknown flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--entyr', './a.js']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--entyr'");
        expect(stderr).toContain("Did you mean '--entry'?");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log an error if an unknown flag is passed and suggests the closest match to an unknown flag #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--output-fileneme', '[name].js']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--output-fileneme'");

        if (isWebpack5) {
            expect(stderr).toContain("Did you mean '--output-filename'?");
        }

        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log an error if an unknown flag is passed and suggests the closest match to an unknown flag #3', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--output-library-auxiliary-comment-commnjs']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--output-library-auxiliary-comment-commnjs'");

        if (isWebpack5) {
            expect(stderr).toContain("Did you mean '--output-library-auxiliary-comment-commonjs'?");
            expect(stderr).toContain("Did you mean '--output-library-auxiliary-comment-commonjs2'?");
        }

        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log an error if an unknown flag is passed and suggests the closest match to an unknown flag using "bundle" command', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['bundle', '--entyr', './a.js']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--entyr'");
        expect(stderr).toContain("Did you mean '--entry'?");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log an error if an unknown flag is passed and suggests the closest match to an unknown flag using "b" command', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['b', '--entyr', './a.js']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--entyr'");
        expect(stderr).toContain("Did you mean '--entry'?");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log an error if an unknown flag is passed and suggests the closest match to an unknown flag using "info" command', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['info', '--outpyt']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--outpyt'");
        expect(stderr).toContain("Did you mean '--output'?");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log an error if an unknown flag is passed and suggests the closest match to an unknown flag using "i" command', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['i', '--outpyt']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Error: Unknown option '--outpyt'");
        expect(stderr).toContain("Did you mean '--output'?");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error if an unknown command passed', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['qqq'], true, [], { TERM_PROGRAM: false });

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown command or entry 'qqq'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error and provide suggestion if an unknown command passed', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['server'], true, [], { TERM_PROGRAM: false });

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown command or entry 'server'");
        expect(stderr).toContain("Did you mean 'serve' (alias 's')?");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });
});
