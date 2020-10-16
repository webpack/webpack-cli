'use strict';
const { existsSync, readFile } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('function configuration', () => {
    it('should throw when env is not supplied', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--env'], false);
        expect(stdout).toBeFalsy();
        expect(stderr).toBeTruthy();
        expect(stderr).toContain(`option '--env <value>' argument missing`);
        expect(exitCode).toEqual(1);
    });
    it('is able to understand a configuration file as a function', () => {
        const { stderr, stdout } = run(__dirname, ['--env', 'isProd']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        // Should generate the appropriate files
        expect(existsSync(resolve(__dirname, './bin/prod.js'))).toBeTruthy();
    });
    it('is able to understand a configuration file as a function', () => {
        const { stderr, stdout } = run(__dirname, ['--env', 'isDev']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        // Should generate the appropriate files
        expect(existsSync(resolve(__dirname, './bin/dev.js'))).toBeTruthy();
    });
    it('Supports passing string in env', () => {
        const { stderr, stdout } = run(__dirname, [
            '--env',
            'environment=production',
            '--env',
            'app.title=Luffy',
            '-c',
            'webpack.env.config.js',
        ]);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        // Should generate the appropriate files
        expect(existsSync(resolve(__dirname, './bin/Luffy.js'))).toBeTruthy();
    });
    it('Supports long nested values in env', () => {
        const { stderr, stdout } = run(__dirname, [
            '--env',
            'file.name.is.this=Atsumu',
            '--env',
            'environment=production',
            '-c',
            'webpack.env.config.js',
        ]);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        // Should generate the appropriate files
        expect(existsSync(resolve(__dirname, './bin/Atsumu.js'))).toBeTruthy();
    });
    it('Supports multiple equal in a string', () => {
        const { stderr, stdout } = run(__dirname, [
            '--env',
            'file=name=is=Eren',
            '--env',
            'environment=multipleq',
            '-c',
            'webpack.env.config.js',
        ]);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        // Should generate the appropriate files
        expect(existsSync(resolve(__dirname, './bin/name=is=Eren.js'))).toBeTruthy();
    });
    it('Supports dot at the end', () => {
        const { stderr, stdout } = run(__dirname, ['--env', 'name.=Hisoka', '--env', 'environment=dot', '-c', 'webpack.env.config.js']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        // Should generate the appropriate files
        expect(existsSync(resolve(__dirname, './bin/Hisoka.js'))).toBeTruthy();
    });
    it('Supports dot at the end', () => {
        const { stderr, stdout } = run(__dirname, ['--env', 'name.', '--env', 'environment=dot', '-c', 'webpack.env.config.js']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        // Should generate the appropriate files
        expect(existsSync(resolve(__dirname, './bin/true.js'))).toBeTruthy();
    });
    it('is able to understand multiple env flags', (done) => {
        const { stderr, stdout } = run(__dirname, ['--env', 'isDev', '--env', 'verboseStats', '--env', 'envMessage']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        // check that the verbose env is respected
        expect(stdout).toContain('LOG from webpack');
        // check if the values from DefinePlugin make it to the compiled code
        readFile(resolve(__dirname, './bin/dev.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toContain('env message present');
            done();
        });
    });
});
