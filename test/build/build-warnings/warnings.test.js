'use strict';

const { runAsync, readFile } = require('../../utils/test-utils');
const { existsSync } = require('fs');
const { resolve } = require('path');

describe('warnings', () => {
    it('should output by default', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatch(/WARNING/);
        expect(stdout).toMatch(/Error: Can't resolve/);
    });

    it('should output JSON with the "json" flag', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--json']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();

        expect(() => JSON.parse(stdout)).not.toThrow();

        const json = JSON.parse(stdout);

        expect(json['hash']).toBeDefined();
        expect(json['warnings']).toHaveLength(2);
        // `message` for `webpack@5`
        expect(json['warnings'][0].message ? json['warnings'][0].message : json['warnings'][0]).toMatch(/Can't resolve/);
    });

    it('should store json to a file', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--json', 'stats.json']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('stats are successfully stored as json to stats.json');
        expect(stdout).toBeFalsy();
        expect(existsSync(resolve(__dirname, './stats.json'))).toBeTruthy();

        let data;

        try {
            data = await readFile(resolve(__dirname, 'stats.json'), 'utf-8');
        } catch (error) {
            expect(error).toBe(null);
        }

        expect(() => JSON.parse(data)).not.toThrow();

        const json = JSON.parse(data);

        expect(json['hash']).toBeDefined();
        expect(json['warnings']).toHaveLength(2);
        // `message` for `webpack@5`
        expect(json['warnings'][0].message ? json['warnings'][0].message : json['warnings'][0]).toMatch(/Can't resolve/);
    });
});
