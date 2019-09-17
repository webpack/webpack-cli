'use strict';
const { stat, readFileSync } = require('fs');
const { resolve, join } = require('path');
const { run } = require('../../utils/test-utils');

describe('json flag', () => {
    it('should match the snapshot of --json command', done => {
        const { stdout } = run(__dirname, [__dirname, '--json']);
        const jsonstdout = JSON.parse(stdout);
        expect(jsonstdout.outputPath).toBe(join(__dirname, 'bin'));
        expect(jsonstdout.assetsByChunkName.main).toBe('bundle.js');
        expect(jsonstdout.chunks[0].modules[0].source.replace(/\s/g, '')).toBe(readFileSync(resolve(__dirname, './index.js'), { encoding: 'utf-8' }).replace(/\s/g, ''));
        expect(jsonstdout.chunks[0].modules[0].reasons[0].userRequest).toBe(join(__dirname));
        expect(jsonstdout.chunks[0].names[0]).toBe('main');
        stat(resolve(__dirname, 'bin/bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(jsonstdout.assets[0].size).toBe(stats.size);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
