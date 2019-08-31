'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('json flag', () => {
    it('should match the snapshot of --json command', done => {
        const { stdout } = run(__dirname, [__dirname, '--json']);
        const jsonstdout = JSON.parse(stdout);
        delete jsonstdout.time;
        delete jsonstdout.builtAt;
        expect(jsonstdout).toMatchSnapshot();
        stat(resolve(__dirname, 'bin/bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
