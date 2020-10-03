const { sync: spawnSync } = require('execa');
const { resolve } = require('path');

describe('interactive', () => {
    it('should work correctly by default', () => {
        const { stdout, stderr } = spawnSync(resolve(__dirname, '../../bin/cli.js'), ['--interactive'], {
            cwd: resolve(__dirname),
            reject: false,
        });
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('InteractiveModePlugin');
    });
});
