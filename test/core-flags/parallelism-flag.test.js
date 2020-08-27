'use strict';

const { run } = require('../utils/test-utils');

describe('--parallelism flag', () => {
    it('should set parallelism to the value passed', () => {
        const { stderr, stdout } = run(__dirname, ['--parallelism', '50']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('parallelism: 50');
    });
});
