'use strict';
const { run } = require('../utils/test-utils');
const { stat } = require('fs');
const { resolve } = require('path');
describe('no-hot flag', () => {
    it('should be successful when --no-hot is passed', done => {
        const { stderr, stdout } = run(__dirname, ['--no-hot']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should use --hot when --hot and --no-hot are passed', done => {
        const { stderr, stdout } = run(__dirname, ['--no-hot', '--hot']);
        expect(stderr).toContain('"--hot" will be used');
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
