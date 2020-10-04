'use strict';

const { run } = require('../utils/test-utils');

describe('bail and watch warning', () => {
    it('should log warning in case of single compiler', () => {
        let { stderr, stdout } = run(__dirname, ['-c', 'webpack.config.js'], false);

        expect(stderr).toContain('starting to restore cache content');
        expect(stdout).toContain('[cached] 1 module');
    });
});
