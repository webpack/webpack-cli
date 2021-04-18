'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
// eslint-disable-next-line node/no-unpublished-require
const { run, readFile } = require('../../../utils/test-utils');

describe('mode flags with config', () => {
    it('should run in production mode when --mode=production is passed', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--mode', 'production', '--config', './webpack.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        // Should generate the appropriate files
        expect(existsSync(resolve(__dirname, './dist/main.js.OTHER.LICENSE.txt'))).toBeTruthy();
        expect(existsSync(resolve(__dirname, './dist/main.js'))).toBeTruthy();
        expect(existsSync(resolve(__dirname, './dist/main.js.map'))).toBeFalsy();

        let data;

        try {
            // Correct mode should be propagated to the compiler
            data = await readFile(resolve(__dirname, './dist/main.js'), 'utf-8');
        } catch (error) {
            expect(error).toBe(null);
        }

        expect(data).toContain('"production mode"');
    });

    it('should run in development mode when --mode=development is passed', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--mode', 'development', '--config', './webpack.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        // Should generate the appropriate files
        expect(existsSync(resolve(__dirname, './dist/main.js.OTHER.LICENSE.txt'))).toBeTruthy();
        expect(existsSync(resolve(__dirname, './dist/main.js'))).toBeTruthy();
        expect(existsSync(resolve(__dirname, './dist/main.js.map'))).toBeFalsy();

        let data;

        try {
            // Correct mode should be propagated to the compiler
            data = await readFile(resolve(__dirname, './dist/main.js'), 'utf-8');
        } catch (error) {
            expect(error).toBe(null);
        }

        expect(data).toContain('development mode');
    });

    it('should run in none mode when --mode=none is passed', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--mode', 'none', '--config', './webpack.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        // Should generate the appropriate files
        // Should generate the appropriate files
        expect(existsSync(resolve(__dirname, './dist/main.js.OTHER.LICENSE.txt'))).toBeTruthy();
        expect(existsSync(resolve(__dirname, './dist/main.js'))).toBeTruthy();
        expect(existsSync(resolve(__dirname, './dist/main.js.map'))).toBeFalsy();

        let data;

        try {
            // Correct mode should be propagated to the compiler
            data = await readFile(resolve(__dirname, './dist/main.js'), 'utf-8');
        } catch (error) {
            expect(error).toBe(null);
        }

        expect(data).toContain('none mode');
    });

    it('should use mode flag over config', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--mode', 'production', '-c', 'webpack.config2.js']);

        expect(exitCode).toEqual(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`mode: 'production'`);
    });

    it('should use mode from flag over NODE_ENV', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--mode', 'none', '-c', 'webpack.config2.js'], false, [], {
            NODE_ENV: 'production',
        });

        expect(exitCode).toEqual(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`mode: 'none'`);
    });

    it('should use mode from config over NODE_ENV', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['-c', 'webpack.config2.js']);

        expect(exitCode).toEqual(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`mode: 'development'`);
    });

    it('should use mode from config when multiple config are supplied', async () => {
        const { exitCode, stdout, stderr } = await run(__dirname, ['-c', 'webpack.config3.js', '-c', 'webpack.config2.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`mode: 'development'`);
        expect(stdout.match(new RegExp("mode: 'development'", 'g')).length).toEqual(1);
    });

    it('mode flag should apply to all configs', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, [
            '--mode',
            'none',
            '-c',
            './webpack.config3.js',
            '-c',
            './webpack.config2.js',
        ]);

        expect(exitCode).toEqual(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`mode: 'none'`);
        expect(stdout.match(new RegExp("mode: 'none'", 'g')).length).toEqual(2);
    });

    it('only config where mode is absent pick up from NODE_ENV', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['-c', './webpack.config3.js', '-c', './webpack.config2.js'], {
            env: {
                NODE_ENV: 'production',
            },
        });

        expect(exitCode).toEqual(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`mode: 'production'`);
        expect(stdout).toContain(`mode: 'development'`);
        expect(stdout.match(new RegExp("mode: 'production'", 'g')).length).toEqual(1);
        expect(stdout.match(new RegExp("mode: 'development'", 'g')).length).toEqual(1);
    });
});
