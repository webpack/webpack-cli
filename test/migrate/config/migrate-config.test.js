'use strict';

const { run, runAndGetWatchProc } = require('../../utils/test-utils');

describe('migrate command', () => {
    it('should warn if the source config file is not specified', () => {
        const { stderr } = run(__dirname, ['migrate'], false);
        expect(stderr).toContain('Please specify a path to your webpack config');
    });

    it('should prompt accordingly if an output path is not specified', () => {
        const { stdout } = run(__dirname, ['migrate', 'webpack.config.js'], false);
        expect(stdout).toContain('? Migration output path not specified');
    });

    it('should throw an error if the user refused to overwrite the source file and no output path is provided', async () => {
        const { stderr } = await runAndGetWatchProc(__dirname, ['migrate', 'webpack.config.js'], false, 'n');
        expect(stderr).toBe('✖ ︎Migration aborted due no output path');
    });

    it('should prompt for config validation when an output path is provided', async () => {
        const { stdout } = await runAndGetWatchProc(__dirname, ['migrate', 'webpack.config.js', 'updated-webpack.config.js'], false, 'y');
        expect(stdout).toContain('? Do you want to validate your configuration?');
    });
});
