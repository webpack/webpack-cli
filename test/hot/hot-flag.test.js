'use strict';
const { run } = require('../utils/test-utils');
const { stat } = require('fs');
const { resolve } = require('path');
const { yellow } = require('colorette');

describe('--hot flag', () => {
    it('should be successful when --hot is passed', (done) => {
        const { stderr, stdout } = run(__dirname, ['--hot']);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('HotModuleReplacementPlugin');

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should warn when --hot and --no-hot both are passed', (done) => {
        const { stderr, stdout } = run(__dirname, ['--no-hot', '--hot']);
        expect(stderr).toContain(
            `[webpack-cli] ${yellow(
                'You provided both --hot and --no-hot. We will use only the last of these flags that you provided in your CLI arguments',
            )}`,
        );
        expect(stdout).toContain('HotModuleReplacementPlugin');

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
