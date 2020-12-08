const { sync: spawnSync } = require('execa');
const path = require('path');

describe('Info', () => {
    it('should run with cli', () => {
        const { exitCode, stderr, stdout } = spawnSync(path.resolve(__dirname, '../bin/cli.js'), ['info'], {
            cwd: path.resolve(__dirname),
            reject: false,
        });

        expect(exitCode).toBe(0);
        expect(stdout).toContain('System');
        expect(stdout).toContain('Binaries');
        expect(stdout).toContain('OS');
        expect(stderr).toBeFalsy();
    });

    it('should respect --output=json', () => {
        const { exitCode, stderr, stdout } = spawnSync(path.resolve(__dirname, '../bin/cli.js'), ['info', '--output=json'], {
            cwd: path.resolve(__dirname),
            reject: false,
        });

        expect(exitCode).toBe(0);
        const testJSON = () => {
            const output = JSON.parse(stdout);
            expect(output['System']).toBeTruthy();
            expect(output['System']['OS']).toBeTruthy();
        };
        expect(testJSON).not.toThrow();
        expect(stderr).toBeFalsy();
    });

    it('should respect --output=markdown', () => {
        const { exitCode, stderr, stdout } = spawnSync(path.resolve(__dirname, '../bin/cli.js'), ['info', '--output=markdown'], {
            cwd: path.resolve(__dirname),
            reject: false,
        });

        expect(exitCode).toBe(0);
        expect(stdout).toContain('## System');
        expect(stdout).toContain('## Binaries');
        expect(stdout).toContain('## Browsers');
        expect(stderr).toBeFalsy();
    });

    it('should throw an error for invalid output type', () => {
        const { exitCode, stderr, stdout } = spawnSync(path.resolve(__dirname, '../bin/cli.js'), ['info', '--output=test'], {
            cwd: path.resolve(__dirname),
            reject: false,
        });

        expect(exitCode).toBe(2);
        expect(stderr).toContain("'test' is not a valid value for output");
        expect(stdout).toBeFalsy();
    });
});
