'use strict';

const { stat } = require('fs');
const { resolve } = require('path');

const { run } = require('../../utils/test-utils');

describe('merge flag configuration', () => {
    it('merges two configurations together', done => {
        const { stderr } = run(__dirname, ['--config', './1.js', '--merge', './2.js'], false);
        expect(stderr).toContain('option has not been set, webpack will fallback to');
        stat(resolve(__dirname, './dist/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
