'use strict';

const { run } = require('../utils/test-utils');
const initPkgJSON = require('../../packages/init/package.json');
const servePkgJSON = require('../../packages/serve/package.json');
const migratePkgJSON = require('../../packages/migrate/package.json');
const infoPkgJSON = require('../../packages/info/package.json');
const pluginPkgJSON = require('../../packages/generate-plugin/package.json');
const loaderPkgJSON = require('../../packages/generate-loader/package.json');
const cliPkgJSON = require('../../packages/webpack-cli/package.json');

describe('version flag with external packages', () => {
    it('outputs version with init', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['init', '--version'], false);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(initPkgJSON.version);
        expect(stdout).toContain(cliPkgJSON.version);
        expect(stderr).toHaveLength(0);
    });

    it('outputs version with the alias c for init', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['c', '--version'], false);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(initPkgJSON.version);
        expect(stdout).toContain(cliPkgJSON.version);
        expect(stderr).toHaveLength(0);
    });

    it('outputs version with info', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['info', '--version'], false);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(infoPkgJSON.version);
        expect(stdout).toContain(cliPkgJSON.version);
        expect(stderr).toHaveLength(0);
    });

    it('outputs version with serve', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['serve', '--version'], false);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(servePkgJSON.version);
        expect(stdout).toContain(cliPkgJSON.version);
        expect(stderr).toHaveLength(0);
    });

    it('outputs version with migrate', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['migrate', '--version'], false);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(migratePkgJSON.version);
        expect(stdout).toContain(cliPkgJSON.version);
        expect(stderr).toHaveLength(0);
    });

    it('outputs version with plugin', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['plugin', '--version'], false);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(pluginPkgJSON.version);
        expect(stdout).toContain(cliPkgJSON.version);
        expect(stderr).toHaveLength(0);
    });

    it('outputs version with loader', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['loader', '--version'], false);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(loaderPkgJSON.version);
        expect(stdout).toContain(cliPkgJSON.version);
        expect(stderr).toHaveLength(0);
    });

    it(' should throw error for multiple commands', () => {
        const { stderr, exitCode } = run(__dirname, ['init', 'migrate', '--version'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(
            "You provided multiple commands - 'init' (alias 'c'), 'migrate' (alias 'm'). Please use only one command at a time.",
        );
    });

    it(' should throw error if invalid argument is present with --version flag', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['init', 'abc', '--version', '--no-color'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`[webpack-cli] Invalid command 'abc'`);
        expect(stderr).toContain('[webpack-cli] Run webpack --help to see available commands and arguments');
        expect(stdout).toBe('');
    });

    it(' should throw error if invalid argument is present with version command', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['init', 'abc', 'version', '--no-color'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`[webpack-cli] Invalid command 'abc'`);
        expect(stderr).toContain('[webpack-cli] Run webpack --help to see available commands and arguments');
        expect(stdout).toBe('');
    });

    it(' should throw error if invalid argument is present with -v alias', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['init', 'abc', '-v', '--no-color'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`[webpack-cli] Invalid command 'abc'`);
        expect(stderr).toContain('[webpack-cli] Run webpack --help to see available commands and arguments');
        expect(stdout).toBe('');
    });
});
