'use strict';

const { run, isWebpack5 } = require('../utils/test-utils');

describe('cache related tests', () => {
    it('should log warning in case of single compiler', () => {
        let { stderr, stdout } = run(__dirname, ['-c', './webpack.config.js'], false);
        // run 2nd compilation
        ({ stderr, stdout } = run(__dirname, ['-c', './webpack.config.js'], false));

        if (isWebpack5) {
            expect(stderr).toContain('starting to restore cache content');
            expect(stdout).toContain('[cached]');
        }
    });
});
