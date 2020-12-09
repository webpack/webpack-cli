'use strict';

const { run } = require('../utils/test-utils');
const initPkgJSON = require('../../packages/init/package.json');
const servePkgJSON = require('../../packages/serve/package.json');
const migratePkgJSON = require('../../packages/migrate/package.json');
const infoPkgJSON = require('../../packages/info/package.json');
const pluginPkgJSON = require('../../packages/generators/package.json');
const loaderPkgJSON = require('../../packages/generators/package.json');
const cliPkgJSON = require('../../packages/webpack-cli/package.json');

describe('version flag with external packages', () => {
    it('outputs version with init', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['init', '--version'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(initPkgJSON.version);
        expect(stdout).toContain(cliPkgJSON.version);
    });

    it('outputs version with info', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['info', '--version'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(infoPkgJSON.version);
        expect(stdout).toContain(cliPkgJSON.version);
    });

    it('outputs version with serve', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['serve', '--version'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(servePkgJSON.version);
        expect(stdout).toContain(cliPkgJSON.version);
    });

    it('outputs version with migrate', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['migrate', '--version'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(migratePkgJSON.version);
        expect(stdout).toContain(cliPkgJSON.version);
    });

    it('outputs version with plugin', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['plugin', '--version'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(pluginPkgJSON.version);
        expect(stdout).toContain(cliPkgJSON.version);
    });

    it('outputs version with loader', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['loader', '--version'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(loaderPkgJSON.version);
        expect(stdout).toContain(cliPkgJSON.version);
    });

    it('outputs version with the alias c for init', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['c', '--version'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(initPkgJSON.version);
        expect(stdout).toContain(cliPkgJSON.version);
    });

    it('should log error for multiple commands', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['init', 'migrate', '--version'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(
            "You provided multiple commands - 'init' (alias 'c'), 'migrate' (alias 'm'). Please use only one command at a time.",
        );
        expect(stdout).toBeFalsy();
    });

    it('should log error if invalid argument is present with --version flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['init', 'abc', '--version', '--no-color'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain(`[webpack-cli] Invalid command 'abc'`);
        expect(stderr).toContain('[webpack-cli] Run webpack --help to see available commands and arguments');
        expect(stdout).toBeFalsy();
    });

    it('should log error if invalid argument is present with version command', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['init', 'abc', 'version', '--no-color'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`[webpack-cli] Invalid command 'abc'`);
        expect(stderr).toContain('[webpack-cli] Run webpack --help to see available commands and arguments');
        expect(stdout).toBeFalsy();
    });

    it(' should throw error if invalid argument is present with -v alias', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['init', 'abc', '-v', '--no-color'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`[webpack-cli] Invalid command 'abc'`);
        expect(stderr).toContain('[webpack-cli] Run webpack --help to see available commands and arguments');
        expect(stdout).toBeFalsy();
    });
});
