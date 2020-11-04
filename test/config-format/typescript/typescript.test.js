/* eslint-disable   node/no-unpublished-require */
const { run, runInstall } = require('../../utils/test-utils');
const { stat } = require('fs');
const { resolve } = require('path');

describe('webpack cli', () => {
    it.skip(
        'should support typescript file',
        async () => {
            await runInstall(__dirname);
            const { stderr, stdout, exitCode } = run(__dirname, ['-c', './webpack.config.ts']);

            expect(stderr).toBeFalsy();
            expect(stdout).toBeTruthy();
            expect(exitCode).toBe(0);
            stat(resolve(__dirname, 'bin/foo.bundle.js'), (err, stats) => {
                expect(err).toBe(null);
                expect(stats.isFile()).toBe(true);
            });
        },
        1000 * 60 * 5,
    );
});
