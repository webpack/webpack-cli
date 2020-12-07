const { run, isWebpack5 } = require('../utils/test-utils');

describe('optimization option in config', () => {
    it('should work with mangleExports disabled', () => {
        const { exitCode, stderr, stdout } = run(__dirname, [], false);

        // Should throw when webpack is less than 5
        if (isWebpack5) {
            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain('mangleExports: false');
        } else {
            expect(exitCode).toBe(2);
            expect(stderr).toContain("configuration.optimization has an unknown property 'mangleExports'");
            expect(stdout).toBeFalsy();
        }
    });
});
