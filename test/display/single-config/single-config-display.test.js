'use strict';

const { run } = require('../../utils/test-utils');
const PROGRESS_TEXT = 'Compilation completed';
const STATS_VERBOSE_TEXT = 'LOG from webpack.buildChunkGraph';

describe('single config display test', () => {
    it('should display profiling information', () => {
        const { stdout, stderr } = run(__dirname, ['--progress']);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(PROGRESS_TEXT);
    });

    it('should display single entry information in stats', () => {
        const { stdout, stderr } = run(__dirname, ['--config', 'webpack.config.single.js', '--stats', 'verbose']);
        expect(stdout).toContain(STATS_VERBOSE_TEXT);
        expect(stderr).toBeFalsy();
    });

    it('should display multiple entry information in stats', () => {
        const { stdout, stderr } = run(__dirname, ['--config', 'webpack.config.multiple.js', '--stats', 'verbose']);
        expect(stdout).toContain(STATS_VERBOSE_TEXT);
        expect(stderr).toBeFalsy();
    });
});
