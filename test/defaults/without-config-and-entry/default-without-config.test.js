'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('output flag defaults without config', () => {
    it('should throw if the entry file is not present', (done) => {
        const { stdout } = run(__dirname, ['--defaults'], false);

        expect(stdout).toContain("Error: Can't resolve './index.js' in");
        stat(resolve(__dirname, './dist/main.js'), (err, stats) => {
            expect(err).toBeTruthy();
            expect(stats).toBe(undefined);
            done();
        });
    });
});
