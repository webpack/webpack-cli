'use strict';
const { run } = require('../utils/test-utils');
const { existsSync, readFile } = require('fs');
const { resolve } = require('path');

const successMessage = 'stats are successfully stored as json to stats.json';

describe('json flag', () => {
    it('should return valid json', () => {
        const { stdout, exitCode } = run(__dirname, ['--json']);
        expect(() => JSON.parse(stdout)).not.toThrow();
        expect(exitCode).toBe(0);
        expect(JSON.parse(stdout)['hash']).toBeDefined();
    });

    it('should store json to a file', (done) => {
        const { stdout, exitCode } = run(__dirname, ['--json', 'stats.json']);

        expect(stdout).toContain(successMessage);
        expect(exitCode).toBe(0);
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

    it('should store json to a file and respect --color flag', (done) => {
        const { stdout, exitCode } = run(__dirname, ['--json', 'stats.json', '--color']);

        expect(stdout).toContain(`[webpack-cli] \u001b[32m${successMessage}`);
        expect(exitCode).toBe(0);

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

    it('should store json to a file and respect --no-color', (done) => {
        const { stdout, exitCode } = run(__dirname, ['--json', 'stats.json', '--no-color']);

        expect(stdout).not.toContain(`[webpack-cli] \u001b[32m${successMessage}`);
        expect(stdout).toContain(`[webpack-cli] ${successMessage}`);
        expect(exitCode).toBe(0);

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

    it('should return valid json with -j alias', () => {
        const { stdout, exitCode } = run(__dirname, ['-j']);
        expect(() => JSON.parse(stdout)).not.toThrow();
        expect(exitCode).toBe(0);
        expect(JSON.parse(stdout)['hash']).toBeDefined();
    });
});
