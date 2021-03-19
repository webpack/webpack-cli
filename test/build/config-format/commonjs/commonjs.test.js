const { run } = require('../../../utils/test-utils');

describe('webpack cli', () => {
    it('should support CommonJS file', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', 'webpack.config.cjs'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });
});
