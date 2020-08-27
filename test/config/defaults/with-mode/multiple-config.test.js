'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('multiple config files', () => {
    it('Uses dev config when development mode is supplied', (done) => {
        const { stdout, stderr } = run(__dirname, ['--mode', 'development'], false);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toBe(undefined);
        stat(resolve(__dirname, './binary/dev.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
