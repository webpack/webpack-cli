'use strict';
const { runAsync } = require('../../../utils/test-utils');

describe('array config error', () => {
    it('should throw syntax error and exit with non-zero exit code when even 1 object has syntax error', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['-c', './webpack.config.js']);
        expect(exitCode).toBe(2);
        expect(stderr).toContain('SyntaxError: Unexpected token');
        expect(stdout).toBeFalsy();
    });
});
