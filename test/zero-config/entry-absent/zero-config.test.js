const { run } = require('../../utils/test-utils');

describe('Zero Config tests', () => {
    it('runs when config and entry are both absent', () => {
        const { stdout, stderr } = run(__dirname, [], false);
        // Entry file is absent, should log the Error from the compiler
        expect(stdout).toContain("Error: Can't resolve './src/index.js'");
        expect(stderr).toBeFalsy();
    });
});
