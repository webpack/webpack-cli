'use strict';
const { stat } = require('fs');
const { resolve, join } = require('path');
const { run } = require('../utils/test-utils');

describe('json flag', () => {
    it('should match the snapshot of --json command', done => {
        const { stdout } = run(__dirname, [__dirname, '--json']);
        const jsonstdout = JSON.parse(stdout);
        expect(jsonstdout.outputPath).toBe(join(__dirname, 'bin'));
        expect(jsonstdout.assetsByChunkName.main[0]).toBe('main.js');
        expect(jsonstdout.chunks[0].modules[0].reasons[1].userRequest).toBe(join(__dirname, 'index.js'));
        expect(jsonstdout.chunks[0].names[0]).toBe('main');
        stat(resolve(__dirname, 'bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(jsonstdout.assets[0].size).toBe(stats.size);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
