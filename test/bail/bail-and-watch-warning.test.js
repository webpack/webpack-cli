'use strict';

const { run } = require('../utils/test-utils');

describe('bail and watch warning', () => {
    it('should log warning in case of single compiler', () => {
        const { stderr, stdout } = run(__dirname, ['-c', 'single-webpack.config.js']);

        expect(stderr).toContain(`You are using "bail" with "watch". "bail" will still exit webpack when the first error is found.`);
        expect(stdout).toBeTruthy();
    });

    it('should log warning in case of multiple compilers', () => {
        const { stderr, stdout } = run(__dirname, ['-c', 'multi-webpack.config.js']);

        expect(stderr).toContain(`You are using "bail" with "watch". "bail" will still exit webpack when the first error is found.`);
        expect(stdout).toBeTruthy();
    });

    it('should log not log warning if both are not true', () => {
        const { stderr, stdout } = run(__dirname, ['-c', 'third-webpack.config.js']);

        expect(stderr).not.toContain(`You are using "bail" with "watch". "bail" will still exit webpack when the first error is found.`);
        expect(stdout).toBeTruthy();
    });
});
