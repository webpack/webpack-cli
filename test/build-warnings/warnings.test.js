'use strict';
const { run } = require('../utils/test-utils');
const { stat, readFile } = require('fs');
const { resolve } = require('path');

describe('warnings', () => {
    it('should output by default', () => {
        const { stdout, exitCode } = run(__dirname);

        expect(stdout).toMatch(/WARNING in/);
        expect(stdout).toMatch(/Error: Can't resolve/);
        expect(exitCode).toBe(0);
    });

    it('should output JSON with the "json" flag', () => {
        const { stdout, exitCode } = run(__dirname, ['--json']);

        expect(() => JSON.parse(stdout)).not.toThrow();
        expect(exitCode).toBe(0);

        const json = JSON.parse(stdout);

        expect(json['hash']).toBeDefined();
        expect(json['warnings']).toHaveLength(1);
        // `message` for `webpack@5`
        expect(json['warnings'][0].message ? json['warnings'][0].message : json['warnings'][0]).toMatch(/Can't resolve/);
    });

    it('should store json to a file', (done) => {
        const { stdout, exitCode } = run(__dirname, ['--json', 'stats.json']);

        expect(stdout).toContain('stats are successfully stored as json to stats.json');
        expect(exitCode).toBe(0);

        stat(resolve(__dirname, './stats.json'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);

            readFile(resolve(__dirname, 'stats.json'), 'utf-8', (error, data) => {
                expect(error).toBe(null);
                expect(() => JSON.parse(data)).not.toThrow();

                const json = JSON.parse(data);

                expect(json['hash']).toBeDefined();
                expect(json['warnings']).toHaveLength(1);
                // `message` for `webpack@5`
                expect(json['warnings'][0].message ? json['warnings'][0].message : json['warnings'][0]).toMatch(/Can't resolve/);

                done();
            });
        });
    });
});
