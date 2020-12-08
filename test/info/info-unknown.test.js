const { runInfo } = require('../utils/test-utils');

describe('should handle unknown args', () => {
    it('shows an appropriate warning on supplying unknown args', () => {
        const { exitCode, stderr, stdout } = runInfo(['--unknown'], __dirname);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown option '--unknown'");
        expect(stdout).toBeFalsy();
    });
});
