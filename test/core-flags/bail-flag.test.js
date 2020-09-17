'use strict';

const { run } = require('../utils/test-utils');

describe('--bail flag', () => {
    it('should set bail to true', () => {
        const { stderr, stdout } = run(__dirname, ['--bail']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('bail: true');
    });

    it('should set bail to false', () => {
        const { stderr, stdout } = run(__dirname, ['--no-bail']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('bail: false');
    });
});
