'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('Node target', () => {
    it('should emit the correct code', (done) => {
        const { stderr } = run(__dirname, ['-c', './webpack.config.js']);
        expect(stderr).toBeFalsy();
        stat(resolve(__dirname, 'bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
