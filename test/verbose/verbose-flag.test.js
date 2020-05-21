'use strict';
// eslint-disable-next-line node/no-unpublished-require
const { run } = require('../utils/test-utils');

describe('verbose flag', () => {
    it('should accept --verbose', () => {
        const { stderr, stdout } = run(__dirname, ['--verbose']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(stdout).toContain('LOG from webpack');
    });
});
