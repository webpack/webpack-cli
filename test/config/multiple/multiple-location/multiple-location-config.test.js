'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('multiple dev config files with webpack.config.js', () => {
    it('Uses webpack.config.development.js', (done) => {
        const { stdout, stderr } = run(__dirname, [], false);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toBe(undefined);
        stat(resolve(__dirname, './binary/dev.folder.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
