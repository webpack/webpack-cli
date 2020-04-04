const { run } = require('../../utils/test-utils');

describe('Zero Config', () => {
    it('runs when config is present but not supplied via flag', () => {
        const { stdout, stderr } = run(__dirname, [], false);
        // Should find the entry file, thus not throw the below warning
        expect(stdout).not.toContain("Module not found: Error: Can't resolve './src'");
        // default entry should be used
        expect(stdout).toContain('./index.js');
        // should pick up the output path from config
        expect(stdout).toContain('Entrypoint main = test-output');
        expect(stderr).toBeFalsy();
    });
});
