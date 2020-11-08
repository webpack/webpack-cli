'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('multiple config files', () => {
    it('Uses dev config when both dev and none are present', (done) => {
        const { stdout, exitCode } = run(__dirname, [], false);

        expect(exitCode).toEqual(0);
        expect(stdout).not.toBe(undefined);
        stat(resolve(__dirname, './binary/dev.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
