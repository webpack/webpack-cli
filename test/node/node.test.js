'use strict';
const { stat } = require('fs');
const { resolve, sep } = require('path');
const { run, extractSummary } = require('../utils/test-utils');

describe('node flags', () => {
    it('is able to options flags to node js', done => {
        const { stdout, stderr } = run(__dirname, ['--node-args', `--require=${resolve(__dirname, 'bootstrap.js')}`, '--node-args', `-r ${resolve(__dirname, 'bootstrap2.js')}`, '--output', './bin/[name].bundle.js'], false);
        expect(stderr).toBe('');
        expect(stdout).toContain('---from bootstrap.js---');
        expect(stdout).toContain('---from bootstrap2.js---');
        const summary = extractSummary(stdout);
        const outputDir = 'node/bin';
        const outDirectoryFromCompiler = summary['Output Directory'].split(sep);
        const outDirToMatch = outDirectoryFromCompiler.slice(outDirectoryFromCompiler.length - 2, outDirectoryFromCompiler.length).join('/');
        expect(outDirToMatch).toContain(outputDir);
        stat(resolve(__dirname, './bin/main.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
