'use strict';

const { run } = require('../utils/test-utils');

describe('bail and watch warning', () => {
    it('should log warning if bail and watch both options are true', () => {
        const { stderr, stdout } = run(__dirname, ['-c', 'webpack.config.js']);

        expect(stderr).toContain(`You are using "bail" with "watch". "bail" will still exit webpack when the first error is found.`);
        expect(stdout).toBeTruthy();
    });
});
