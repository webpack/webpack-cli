'use strict';

const { run, isWebpack5 } = require('../../utils/test-utils');

describe('progress flag', () => {
    it('should show progress', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--progress']);

        expect(exitCode).toBe(0);
        expect(stderr).not.toMatch(/\[webpack\.Progress] \d+ ms setup/);
        expect(stderr).toContain('[webpack.Progress] 100%');
        expect(stdout).toContain('main.js');
    });

    it('should support the "profile" value', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--progress=profile']);

        expect(exitCode).toBe(0);

        if (isWebpack5) {
            expect(stderr).toMatch(/\[webpack\.Progress] \d+ ms setup/);
        }

        expect(stderr).toContain('[webpack.Progress] 100%');
        expect(stdout).toContain('main.js');
    });

    it('should not support invalid value', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--progress=unknown']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`'unknown' is an invalid value for the --progress option. Only 'profile' is allowed.`);
        expect(stdout).toBeFalsy();
    });

    it('should not add duplicate plugins', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', 'webpack.progress.config.js', '--progress']);

        expect(exitCode).toEqual(0);
        expect(stderr).not.toMatch(/\[webpack\.Progress] \d+ ms setup/);
        expect(stderr).toContain('[webpack.Progress] 100%');
        expect(stdout).toContain('main.js');
        expect(stdout.match(/ProgressPlugin/g)).toHaveLength(1);
    });
});
