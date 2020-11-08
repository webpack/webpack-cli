'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('Default configuration files: ', () => {
    it('Uses prod config from dot folder if present', (done) => {
        const { stdout, exitCode } = run(__dirname, [], false);

        expect(exitCode).toBe(0);
        expect(stdout).not.toBe(undefined);
        stat(resolve(__dirname, './binary/prod.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
