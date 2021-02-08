'use strict';

const { run } = require('../utils/test-utils');
const { existsSync, readFile } = require('fs');
const { resolve } = require('path');

describe('warnings', () => {
    it('should output by default', () => {
        const { exitCode, stderr, stdout } = run(__dirname);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatch(/WARNING/);
        expect(stdout).toMatch(/Error: Can't resolve/);
    });

    it('should output JSON with the "json" flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--json']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();

        expect(() => JSON.parse(stdout)).not.toThrow();

        const json = JSON.parse(stdout);

        expect(json['hash']).toBeDefined();
        expect(json['warnings']).toHaveLength(2);
        // `message` for `webpack@5`
        expect(json['warnings'][0].message ? json['warnings'][0].message : json['warnings'][0]).toMatch(/Can't resolve/);
    });

    it('should store json to a file', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--json', 'stats.json']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('stats are successfully stored as json to stats.json');
        expect(stdout).toBeFalsy();
        expect(existsSync(resolve(__dirname, './stats.json'))).toBeTruthy();

        readFile(resolve(__dirname, 'stats.json'), 'utf-8', (error, data) => {
            expect(error).toBe(null);
            expect(() => JSON.parse(data)).not.toThrow();

            const json = JSON.parse(data);

            expect(json['hash']).toBeDefined();
            expect(json['warnings']).toHaveLength(2);
            // `message` for `webpack@5`
            expect(json['warnings'][0].message ? json['warnings'][0].message : json['warnings'][0]).toMatch(/Can't resolve/);

            done();
        });
    });
});
