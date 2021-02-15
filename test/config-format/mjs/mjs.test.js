const { run } = require('../../utils/test-utils');

describe('webpack cli', () => {
    it('should support mjs config format', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', 'webpack.config.mjs'], {
            env: { WEBPACK_CLI_FORCE_LOAD_ESM_CONFIG: true },
        });

        console.log(exitCode);
        console.log(stderr);
        console.log(stdout);

        if (/Error: Not supported/.test(stderr)) {
            expect(exitCode).toBe(2);
            expect(stdout).toBeFalsy();
        } else {
            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toBeTruthy();
        }
    });
});
