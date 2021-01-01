'use strict';
const { run } = require('../utils/test-utils');
const { existsSync, readFile } = require('fs');
const { resolve } = require('path');

const successMessage = 'stats are successfully stored as json to stats.json';

describe('json', () => {
    it('should work and output json stats', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--json']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(() => JSON.parse(stdout)).not.toThrow();
        expect(JSON.parse(stdout)['hash']).toBeDefined();
    });

    it('should work and store json to a file', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--json', 'stats.json']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain(successMessage);
        expect(stdout).toBeFalsy();
        expect(existsSync(resolve(__dirname, './stats.json'))).toBeTruthy();

        readFile(resolve(__dirname, 'stats.json'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(JSON.parse(data)['hash']).toBeTruthy();
            expect(JSON.parse(data)['version']).toBeTruthy();
            expect(JSON.parse(data)['time']).toBeTruthy();
            expect(() => JSON.parse(data)).not.toThrow();
            done();
        });
    });

    it('should work and store json to a file and respect --color flag', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--json', 'stats.json', '--color']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain(`\u001b[32m${successMessage}`);
        expect(stdout).toBeFalsy();
        expect(existsSync(resolve(__dirname, './stats.json'))).toBeTruthy();

        readFile(resolve(__dirname, 'stats.json'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(JSON.parse(data)['hash']).toBeTruthy();
            expect(JSON.parse(data)['version']).toBeTruthy();
            expect(JSON.parse(data)['time']).toBeTruthy();
            expect(() => JSON.parse(data)).not.toThrow();
            done();
        });
    });

    it('should work and store json to a file and respect --no-color', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--json', 'stats.json', '--no-color']);

        expect(exitCode).toBe(0);
        expect(stderr).not.toContain(`\u001b[32m${successMessage}`);
        expect(stderr).toContain(`${successMessage}`);
        expect(stdout).toBeFalsy();
        expect(existsSync(resolve(__dirname, './stats.json'))).toBeTruthy();

        readFile(resolve(__dirname, 'stats.json'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(JSON.parse(data)['hash']).toBeTruthy();
            expect(JSON.parse(data)['version']).toBeTruthy();
            expect(JSON.parse(data)['time']).toBeTruthy();
            expect(() => JSON.parse(data)).not.toThrow();
            done();
        });
    });

    it('should work using the "-j" option (alias)', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-j']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(() => JSON.parse(stdout)).not.toThrow();
        expect(JSON.parse(stdout)['hash']).toBeDefined();
    });

    it('should work and output json stats with the "--progress" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--json', '--progress']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('webpack.Progress');
        expect(() => JSON.parse(stdout)).not.toThrow();
        expect(JSON.parse(stdout)['hash']).toBeDefined();
    });

    it('should work and store json to a file with the "--progress" option', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--json', 'stats.json', '--progress']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('webpack.Progress');
        expect(stderr).toContain(successMessage);
        expect(stdout).toBeFalsy();
        expect(existsSync(resolve(__dirname, './stats.json'))).toBeTruthy();

        readFile(resolve(__dirname, 'stats.json'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(JSON.parse(data)['hash']).toBeTruthy();
            expect(JSON.parse(data)['version']).toBeTruthy();
            expect(JSON.parse(data)['time']).toBeTruthy();
            expect(() => JSON.parse(data)).not.toThrow();
            done();
        });
    });

    it('should work and output json stats with cli logs', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--json', '--config', 'logging.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting');
        expect(stderr).toContain('Compilation finished');
        expect(() => JSON.parse(stdout)).not.toThrow();
        expect(JSON.parse(stdout)['hash']).toBeDefined();
    });

    it('should work and store json to a file with cli logs', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--json', 'stats.json', '--config', 'logging.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting');
        expect(stderr).toContain('Compilation finished');
        expect(stderr).toContain(successMessage);
        expect(stdout).toBeFalsy();
        expect(existsSync(resolve(__dirname, './stats.json'))).toBeTruthy();

        readFile(resolve(__dirname, 'stats.json'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(JSON.parse(data)['hash']).toBeTruthy();
            expect(JSON.parse(data)['version']).toBeTruthy();
            expect(JSON.parse(data)['time']).toBeTruthy();
            expect(() => JSON.parse(data)).not.toThrow();
            done();
        });
    });
});
