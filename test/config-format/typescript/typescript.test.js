/* eslint-disable   node/no-missing-require */
/* eslint-disable   node/no-unpublished-require */
const { run, runInstall } = require('../../utils/test-utilsils');
const { stat } = require('fs');
const { resolve } = require('path');

jest.setTimeout(1000 * 60 * 5);

describe('webpack cli', () => {
    it(
        'should support typescript file',
        async () => {
            await runInstall(__dirname);
            const { stderr, stdout } = run(__dirname, ['-c', './webpack.config.ts']);
            expect(stderr).toBeFalsy();
            expect(stdout).toBeTruthy();
            stat(resolve(__dirname, 'bin/foo.bundle.js'), (err, stats) => {
                expect(err).toBe(null);
                expect(stats.isFile()).toBe(true);
            });
        },
        1000 * 60 * 5,
    );
});
