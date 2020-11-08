'use strict';
const { resolve } = require('path');
const { stat } = require('fs');
const { run } = require('../../utils/test-utils');

describe('functional config', () => {
    it('should work as expected in case of single config', (done) => {
        const { stdout, exitCode } = run(__dirname, ['--config', resolve(__dirname, 'single-webpack.config.js')]);

        expect(stdout).toContain('./src/index.js');
        expect(exitCode).toBe(0);

        stat(resolve(__dirname, './bin/dist-single.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should work as expected in case of multiple config', (done) => {
        const { stderr, exitCode } = run(__dirname, ['--config', resolve(__dirname, 'multi-webpack.config.js')]);

        expect(stderr).toContain('first');
        expect(stderr).toContain('second');
        expect(exitCode).toBe(0);

        stat(resolve(__dirname, './bin/dist-first.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
        stat(resolve(__dirname, './bin/dist-second.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
