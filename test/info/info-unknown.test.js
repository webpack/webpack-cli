const { run } = require('../utils/test-utils');

describe('should handle unknown args', () => {
    it('shows an appropriate warning on supplying unknown args', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['info', '--unknown'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("unknown option '--unknown'");
        expect(stdout).toBeFalsy();
    });
});
