/* eslint-disable   node/no-unpublished-require */
const { run, runInstall } = require('../../utils/test-utils');
const { existsSync } = require('fs');
const { resolve } = require('path');

describe('webpack cli', () => {
    it.skip(
        'should support typescript file',
        async () => {
            await runInstall(__dirname);
            const { exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.config.ts']);

            expect(stderr).toBeFalsy();
            expect(stdout).toBeTruthy();
            expect(exitCode).toBe(0);
            expect(existsSync(resolve(__dirname, 'bin/foo.bundle.js'))).toBeTruthy();
        },
        1000 * 60 * 5,
    );
});
