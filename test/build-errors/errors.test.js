'use strict';
const { run } = require('../utils/test-utils');
const { stat, readFile } = require('fs');
const { resolve } = require('path');

describe('errors', () => {
    it('should output by default', () => {
        const { stdout, exitCode } = run(__dirname);

        expect(stdout).toMatch(/ERROR/);
        expect(stdout).toMatch(/Error: Can't resolve/);
        expect(exitCode).toBe(1);
    });

    it('should output JSON with the "json" flag', () => {
        const { stdout, exitCode } = run(__dirname, ['--json']);

        expect(() => JSON.parse(stdout)).not.toThrow();
        expect(exitCode).toBe(1);

        const json = JSON.parse(stdout);

        expect(json['hash']).toBeDefined();
        expect(json['errors']).toHaveLength(1);
        // `message` for `webpack@5`
        expect(json['errors'][0].message ? json['errors'][0].message : json['errors'][0]).toMatch(/Can't resolve/);
    });

    it('should store json to a file', (done) => {
        const { stdout, exitCode } = run(__dirname, ['--json', 'stats.json']);

        expect(stdout).toContain('stats are successfully stored as json to stats.json');
        expect(exitCode).toBe(1);

        stat(resolve(__dirname, './stats.json'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);

            readFile(resolve(__dirname, 'stats.json'), 'utf-8', (error, data) => {
                expect(error).toBe(null);
                expect(() => JSON.parse(data)).not.toThrow();

                const json = JSON.parse(data);

                expect(json['hash']).toBeDefined();
                expect(json['errors']).toHaveLength(1);
                // `message` for `webpack@5`
                expect(json['errors'][0].message ? json['errors'][0].message : json['errors'][0]).toMatch(/Can't resolve/);

                done();
            });
        });
    });
});
