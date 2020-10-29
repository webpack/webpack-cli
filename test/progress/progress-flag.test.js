'use strict';

const { run } = require('../utils/test-utils');

describe('progress flag', () => {
    it('should show progress', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--progress']);

        expect(exitCode).toBe(0);
        expect(stderr).not.toMatch(/\[webpack\.Progress] \d+ ms setup/);
        expect(stderr).toContain('[webpack.Progress] 100%');
        expect(stdout).toContain('main.js');
    });

    it('should support the "profile" value', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--progress=profile']);

        expect(exitCode).toBe(0);
        expect(stderr).toMatch(/\[webpack\.Progress] \d+ ms setup/);
        expect(stderr).toContain('[webpack.Progress] 100%');
        expect(stdout).toContain('main.js');
    });

    it('should not add duplicate plugins', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['-c', 'webpack.progress.config.js', '--progress']);

        expect(exitCode).toEqual(0);
        expect(stdout.match(/ProgressPlugin/g)).toHaveLength(1);
        expect(stderr).not.toMatch(/\[webpack\.Progress] \d+ ms setup/);
        expect(stderr).toContain('[webpack.Progress] 100%');
        expect(stdout).toContain('main.js');
    });
});
