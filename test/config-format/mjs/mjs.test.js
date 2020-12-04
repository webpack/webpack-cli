const { run } = require('../../utils/test-utils');

describe('webpack cli', () => {
    it('should support mjs config format', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', 'webpack.config.mjs'], false, [], { DISABLE_V8_COMPILE_CACHE: true });

        if (exitCode === 0) {
            expect(exitCode).toBe(0);
            expect(stderr).toContain('Compilation starting...');
            expect(stderr).toContain('Compilation finished');
            expect(stdout).toBeTruthy();
        } else {
            expect(exitCode).toBe(2);
            expect(stderr).toContain('Unexpected token');
            expect(stdout).toBeFalsy();
        }
    });
});
