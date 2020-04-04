const { run } = require('../../utils/test-utils');

describe('Zero Config tests', () => {
    it('runs when no config is supplied but entry is present', () => {
        const { stdout, stderr } = run(__dirname, [], false);
        // Should be able to find the entry file
        expect(stdout).not.toContain("Module not found: Error: Can't resolve './src'");
        expect(stdout).toContain('./src/index.js 21 bytes [built]');
        // Should output at the default output dir and filename
        expect(stdout).toContain('Entrypoint main = main.js');
        expect(stderr).toBeFalsy();
    });
});
