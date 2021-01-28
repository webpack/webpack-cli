const { run } = require('../../utils/test-utils');

describe('webpack cli', () => {
    it('should support mjs config format', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', 'webpack.config.mjs'], [], { DISABLE_V8_COMPILE_CACHE: true });

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });
});
