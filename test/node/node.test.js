'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../utils/test-utils');

// TODO - We pass node args to `nodeOptions` in execa,
// passing via NODE_OPTIONS=<args> in env in execa
// throws different error from what we manually see
describe('node flags', () => {
    it('is able to pass the options flags to node js', async (done) => {
        const { stdout, exitCode } = await run(__dirname, ['--output-path', './bin'], false, [
            `--require=${resolve(__dirname, 'bootstrap.js')}`,
            `--require=${resolve(__dirname, 'bootstrap2.js')}`,
        ]);

        expect(exitCode).toBe(0);
        expect(stdout).toContain('---from bootstrap.js---');
        expect(stdout).toContain('---from bootstrap2.js---');

        stat(resolve(__dirname, './bin/main.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('throws an error on supplying unknown flags', async () => {
        const { stderr, exitCode } = await run(__dirname, [], false, ['--unknown']);

        expect(exitCode).not.toBe(0);
        expect(stderr).toContain('bad option');
    });

    it('throws an error if no values were supplied with --max-old-space-size', async () => {
        const { stderr, stdout, exitCode } = await run(__dirname, [], false, ['--max-old-space-size']);

        expect(exitCode).not.toBe(0);
        expect(stderr).toContain('value for flag --max-old-space-size');
        expect(stdout).toBeFalsy();
    });

    it('throws an error if an illegal value was supplied with --max-old-space-size', async () => {
        const { stderr, stdout, exitCode } = await run(__dirname, [], true, ['--max_old_space_size=1024a']);

        expect(exitCode).not.toBe(0);
        expect(stderr).toContain('Error: illegal value for flag --max_old_space_size=1024a of type size_t');
        expect(stdout).toBeFalsy();
    });
});
