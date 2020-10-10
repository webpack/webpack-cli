'use strict';

// eslint-disable-next-line node/no-unpublished-require
const { run } = require('../utils/test-utils');

describe('progress flag', () => {
    it('should show progress', () => {
        const { stderr, stdout } = run(__dirname, ['--progress']);
        expect(stderr).toContain('[webpack.Progress] 100%');
        expect(stdout).toContain('main.js');
    });

    it('should not add duplicate plugins', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['-c', 'webpack.progress.config.js', '--progress']);
        // Only 1 progress plugin should be applied to the compiler
        expect(stdout.match(/ProgressPlugin/g)).toHaveLength(1);
        expect(stderr).toContain('[webpack.Progress] 100%');
        expect(stdout).toContain('main.js');
        expect(exitCode).toEqual(0);
    });
});
