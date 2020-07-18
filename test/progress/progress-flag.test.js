'use strict';

const { options } = require('colorette');
// eslint-disable-next-line node/no-unpublished-require
const { run } = require('../utils/test-utils');

describe('progress flag', () => {
    it('should show progress', () => {
        const { stderr, stdout } = run(__dirname, ['--progress']);
        //Disable color for consistent behavior with windows CI
        options.enabled = false;

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('100% : Compilation completed');
    });
});
