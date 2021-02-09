'use strict';

const { run, runWatch } = require('../utils/test-utils');
const { resolve } = require('path');

describe('infrastructure logging related flag', () => {
    it('should set infrastructureLogging.debug properly', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--infrastructure-logging-debug', 'myPlugin']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`debug: [ 'myPlugin' ]`);
    });

    it('should reset infrastructureLogging.debug to []', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--infrastructure-logging-debug-reset']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`debug: []`);
    });

    it('should set infrastructureLogging.level properly', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--infrastructure-logging-level', 'log']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain(`level: 'log'`);
    });

    it('should log used default config when level is log', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--infrastructure-logging-level', 'log']);

        expect(exitCode).toBe(0);
        const configPath = resolve(__dirname, './webpack.config.js');
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain(`Using config ${configPath}`);
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain(`level: 'log'`);
    });

    it('should log used supplied config when level is log', () => {
        const { exitCode, stderr, stdout } = run(__dirname, [
            '--config',
            'webpack.cache.config.js',
            '--infrastructure-logging-level',
            'log',
        ]);

        expect(exitCode).toBe(0);
        const configPath = resolve(__dirname, './webpack.cache.config.js');
        expect(stderr).toContain(`Using config ${configPath}`);
        expect(stdout).toContain(`level: 'log'`);
    });

    it('should log used supplied config with watch', async () => {
        const { stderr, stdout } = await runWatch(__dirname, [
            '--config',
            'webpack.cache.config.js',
            '--infrastructure-logging-level',
            'log',
        ]);

        const configPath = resolve(__dirname, './webpack.cache.config.js');
        expect(stderr).toContain(`Using config ${configPath}`);
        expect(stdout).toContain(`level: 'log'`);
    });

    it('should log used supplied config with serve', async () => {
        const { stderr, stdout } = await runWatch(__dirname, [
            'serve',
            '--config',
            'webpack.cache.config.js',
            '--infrastructure-logging-level',
            'log',
        ]);

        const configPath = resolve(__dirname, './webpack.cache.config.js');
        expect(stderr).toContain(`Using config ${configPath}`);
        expect(stdout).toContain(`level: 'log'`);
    });
});
