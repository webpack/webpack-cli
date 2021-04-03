'use strict';
const { run } = require('../../../utils/test-utils');

describe('Node target', () => {
    it('should emit the correct code', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['-c', './webpack.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });
});
