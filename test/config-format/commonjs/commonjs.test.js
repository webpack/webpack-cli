const { run } = require('../../utils/test-utils');

describe('webpack cli', () => {
    it('should support CommonJS file', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', 'webpack.config.cjs'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toBeTruthy();
    });
});
