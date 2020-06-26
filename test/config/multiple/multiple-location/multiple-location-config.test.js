'use strict';
const { stat } = require('fs');
const { resolve, join } = require('path');
const { run } = require('../../../utils/test-utils');
const rimraf = require('rimraf');

const outputPath = join(__dirname, 'binary');

describe('multiple dev config files with webpack.config.js', () => {
    afterEach(() => rimraf.sync(outputPath));
    beforeAll(() => rimraf.sync(outputPath));

    it('Uses webpack.config.development.js', (done) => {
        const { stdout, stderr } = run(__dirname, [], false);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toBe(undefined);
        stat(resolve(__dirname, './binary/development.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
