'use strict';

const { run } = require('../utils/test-utils');

describe('--profile flag', () => {
    it('should set profile to true', () => {
        const { stderr, stdout } = run(__dirname, ['--profile']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('profile: true');
    });

    it('should set profile to false', () => {
        const { stderr, stdout } = run(__dirname, ['--no-profile']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('profile: false');
    });
});
