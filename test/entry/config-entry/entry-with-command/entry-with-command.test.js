'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('config entry and command entry all exist', () => {
    it('should use command entry if config command existed', (done) => {
        const { stdout } = run(__dirname, ['-c', '../1.js', './index.js'], false);

        expect(stdout).toContain('./index.js');
        stat(resolve(__dirname, './binary/main.bundle.js'), (err, stats) => {
            expect(err).toBeFalsy();
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
