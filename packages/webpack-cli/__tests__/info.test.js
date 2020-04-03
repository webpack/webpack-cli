const { sync: spawnSync } = require('execa');
const path = require('path');

describe('Info', () => {
    it('should run with cli', () => {
        const { stdout, stderr } = spawnSync(path.resolve(__dirname, '../bin/cli.js'), [], {
            cwd: path.resolve(__dirname),
            reject: false,
        });
        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
    });
});
