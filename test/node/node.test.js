'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../utils/test-utils');

describe('node flags', () => {
    it('is able to pass the options flags to node js', async (done) => {
        const { stdout, stderr } = await run(__dirname, ['--output', './bin/[name].bundle.js'], false, [
            `--require=${resolve(__dirname, 'bootstrap.js')}`,
            `--require=${resolve(__dirname, 'bootstrap2.js')}`,
        ]);
        expect(stdout).toContain('---from bootstrap.js---');
        expect(stdout).toContain('---from bootstrap2.js---');
        expect(stderr).toBeFalsy();
        stat(resolve(__dirname, './bin/main.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('throws an error on supplying unknown flags', async () => {
        const { stderr } = await run(__dirname, [], false, ['--unknown']);
        expect(stderr).toContain('bad option');
    });

    it('throws an error if no values were supplied with --max-old-space-size', async () => {
        const { stderr, stdout } = await run(__dirname, [], false, ['--max-old-space-size']);
        expect(stderr).toContain('missing value for flag --max-old-space-size');
        expect(stdout).toBeFalsy();
    });

    it('throws an error if an illegal value was supplied with --max-old-space-size', async () => {
        const { stderr, stdout } = await run(__dirname, [], true, ['--max_old_space_size=1024a']);
        expect(stderr).toContain('Error: illegal value for flag --max_old_space_size=1024a of type size_t');
        expect(stdout).toBeFalsy();
    });
});
