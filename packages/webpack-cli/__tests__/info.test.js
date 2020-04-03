const { sync: spawnSync } = require('execa');
const path = require('path');

describe('Info', () => {
    it('should run with cli', () => {
        const { stdout, stderr } = spawnSync(path.resolve(__dirname, '../bin/cli.js'), ['info'], {
            cwd: path.resolve(__dirname),
            reject: false,
        });
        expect(stdout).toContain('System');
        expect(stdout).toContain('Binaries');
        expect(stdout).toContain('OS');
        expect(stderr).toBeFalsy();
    });

    it('should work with flags', () => {
        const { stdout, stderr } = spawnSync(path.resolve(__dirname, '../bin/cli.js'), ['info', '--output=json'], {
            cwd: path.resolve(__dirname),
            reject: false,
        });

        const testJSON = () => {
            const output = JSON.parse(stdout);
            expect(output['System']).toBeTruthy();
            expect(output['System']['OS']).toBeTruthy();
        };
        expect(testJSON).not.toThrow();
        expect(stderr).toBeFalsy();
    });
});
