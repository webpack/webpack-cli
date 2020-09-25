'use strict';
const { run } = require('../utils/test-utils');
const { stat, readFile } = require('fs');
const { resolve } = require('path');

describe('json flag', () => {
    it('should return valid json', () => {
        const { stdout } = run(__dirname, ['--json']);

        // helper function to check if JSON is valid
        const parseJson = () => {
            return JSON.parse(stdout);
        };
        // check the JSON is valid.
        expect(JSON.parse(stdout)['hash']).toBeTruthy();
        expect(JSON.parse(stdout)['version']).toBeTruthy();
        expect(JSON.parse(stdout)['time']).toBeTruthy();
        expect(parseJson).not.toThrow();
    });

    it('should store json to a file', (done) => {
        const { stdout } = run(__dirname, ['--json', 'stats.json']);

        expect(stdout).toContain('stats are successfully stored as json to stats.json');
        stat(resolve(__dirname, './stats.json'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
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
        const { stdout } = run(__dirname, ['-j']);

        // helper function to check if JSON is valid
        const parseJson = () => {
            return JSON.parse(stdout);
        };
        // check the JSON is valid.
        expect(JSON.parse(stdout)['hash']).toBeTruthy();
        expect(JSON.parse(stdout)['version']).toBeTruthy();
        expect(JSON.parse(stdout)['time']).toBeTruthy();
        expect(parseJson).not.toThrow();
    });
});
