'use strict';

// eslint-disable-next-line node/no-unpublished-require
const { run } = require('../utils/test-utils');

describe('progress flag', () => {
    it('should show progress', () => {
        const { stderr, stdout } = run(__dirname, ['--progress']);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('100%');
        expect(stdout).toContain('Compilation completed');
    });
});
