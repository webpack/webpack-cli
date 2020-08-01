'use strict';
const { readdir } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('source-map object', () => {
    it('should treat source-map settings right', (done) => {
        const { stderr } = run(__dirname, [], false);
        expect(stderr).toBe('');
        readdir(resolve(__dirname, 'dist'), (err, files) => {
            expect(err).toBe(null);
            expect(files.length).toBe(3);
            done();
        });
    });
    it('should override entire array on flag', (done) => {
        const { stderr } = run(__dirname, ['--devtool', 'source-map', '--output', './binary'], false);
        expect(stderr).toBe('');
        readdir(resolve(__dirname, 'binary'), (err, files) => {
            expect(err).toBe(null);
            expect(files.length).toBe(4);
            done();
        });
    });
});
