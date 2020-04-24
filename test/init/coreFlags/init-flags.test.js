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
});
