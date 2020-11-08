'use strict';

const { run } = require('../../utils/test-utils');

const firstPrompt = 'Will your application have multiple bundles?';

describe('init with core flags', () => {
    it('should output help with --help flag', () => {
        const { stdout } = run(__dirname, ['init', '--help'], false);

        expect(stdout).not.toContain(firstPrompt);
        expect(stdout).toContain('Initialize a new webpack configuration');
    });
    it('should throw error with invalid scaffolder package', () => {
        const { stderr } = run(__dirname, ['init', 'webpack-rocks'], false);

        expect(stderr).toContain(`It should be prefixed with 'webpack-scaffold', but have different suffix`);
    });
});
