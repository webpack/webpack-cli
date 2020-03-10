const { run } = require('../utils/test-utils');

describe('standard output', () => {
    it('should print standard output', () => {
        const { stdout, stderr } = run(__dirname);
        expect(stdout).toBeTruthy();
        expect(stdout).toContain('Hash');
        expect(stdout).toContain('Version');
        expect(stdout).toContain('Built at');
        expect(stdout).toContain('Time');
        expect(stderr).toBeFalsy();
    });
});
