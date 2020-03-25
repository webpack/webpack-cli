'use strict';

const { stat } = require('fs');
const { resolve } = require('path');

const { run } = require('../../utils/test-utils');

describe.skip('merge flag configuration', () => {
    it('merges two configurations together', done => {
        const { stdout } = run(__dirname, ['--config', './1.js', '--merge', './2.js'], false);
        expect(stdout).toContain('option has not been set, webpack will fallback to');
        stat(resolve(__dirname, './dist/merged.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
