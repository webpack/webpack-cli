'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('default entry and config entry all exist', () => {
    it('should use config entry if config entry existed', (done) => {
        const { stdout } = run(__dirname, ['-c', '../1.js'], false);

        expect(stdout).toContain('./a.js');
        stat(resolve(__dirname, './binary/index.bundle.js'), (err, stats) => {
            expect(err).toBeFalsy();
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
