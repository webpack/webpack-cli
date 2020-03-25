'use strict';

const { stat } = require('fs');
const { resolve } = require('path');

const { run } = require('../../utils/test-utils');

describe('dotfolder single config lookup', () => {
    it('should find a webpack configuration in a dotfolder', done => {
        const { stdout, stderr } = run(__dirname, [], false);
        expect(stderr).not.toBeUndefined();
        expect(stdout).not.toBeUndefined();

        expect(stdout).not.toContain('Module not found');
        stat(resolve(__dirname, './dist/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
