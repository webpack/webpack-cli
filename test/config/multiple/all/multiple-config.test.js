'use strict';
const { stat } = require('fs');
const { resolve, join } = require('path');
const { run } = require('../../../utils/test-utils');
const rimraf = require('rimraf');

const outputPath = join(__dirname, 'binary');

describe('multiple config files', () => {
    afterEach(() => rimraf.sync(outputPath));
    beforeAll(() => rimraf.sync(outputPath));

    it('Uses prod config from dot folder if present', (done) => {
        const { stdout, stderr } = run(__dirname, [], false);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toBe(undefined);
        stat(resolve(__dirname, './binary/prod.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
