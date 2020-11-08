'use strict';

const { stat } = require('fs');
const { resolve } = require('path');

const { run } = require('../../utils/test-utils');

describe('single entry flag index present', () => {
    it('finds default index file and compiles successfully', (done) => {
        const { stderr, exitCode } = run(__dirname);

        expect(stderr).not.toContain('Module not found');
        expect(exitCode).toBe(0);

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('finds default index file, compiles and overrides with flags successfully', (done) => {
        run(__dirname, ['--output-path', 'bin']);

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
