const { sync: spawnSync } = require('execa');
const path = require('path');

describe('Serve', () => {
    it('should run with cli', () => {
        const { stdout, stderr } = spawnSync(path.resolve(__dirname, '../../bin/cli.js'), ['serve'], {
            cwd: path.resolve(__dirname),
            reject: false,
        });
        expect(stdout).toContain('main.js');
        expect(stdout).not.toContain('hot/dev-server.js');
        expect(stderr).toHaveLength(0);
    });

    it('should work with flags', () => {
        const { stdout, stderr } = spawnSync(path.resolve(__dirname, '../../bin/cli.js'), ['serve', '--hot'], {
            cwd: path.resolve(__dirname),
            reject: false,
        });
        expect(stdout).toContain('main.js');
        expect(stdout).toContain('hot/dev-server.js');
        expect(stderr).toHaveLength(0);
    });
});
