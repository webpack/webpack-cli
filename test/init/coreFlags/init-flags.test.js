'use strict';

const firstPrompt = 'Will your application have multiple bundles?';
const { run } = require('../../utils/test-utils');

describe('init with core flags', () => {
    it('should output help with --help flag', () => {
        const { stdout, stderr } = run(__dirname, ['init', '--help'], false);
        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
        expect(stdout).not.toContain(firstPrompt);
        expect(stdout).toContain('Initialize a new webpack configuration');
    });
    it('throws error on unknown flag', () => {
        const { stdout, stderr } = run(__dirname, ['init', '--unknown'], false);
        expect(stdout).toBeFalsy();
        expect(stderr).toContain('Unknown argument: --unknown');
    });
    it('should throw error with invalid scaffolder package', () => {
        const { stdout, stderr } = run(__dirname, ['init', 'webpack-rocks'], false);
        expect(stdout).toBeFalsy();
        expect(stderr).toBeTruthy();
        expect(stderr).toContain("[webpack-cli] Promise rejection: TypeError: webpack-rocks isn't a valid name");
    });
});
