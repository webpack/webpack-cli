const { run } = require('../../utils/test-utils');

describe('Silent flag should not log anything', () => {
    it('should not log anything when silent flag is supplied', () => {
        const { stdout, stderr } = run(__dirname, ['--silent']);
        expect(stdout).toBeFalsy();
        expect(stderr).toBeFalsy();
    });
    it('should ignore stats flag when silent is supplied', () => {
        const { stdout, stderr } = run(__dirname, ['--silent', '--stats', 'minimal']);
        expect(stdout).toBeFalsy();
        expect(stderr).toContain('"--stats"  will be ignored');
    });
});
