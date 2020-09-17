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

    it('should log warning if --bail and --watch are used together', () => {
        const { stderr, stdout } = run(__dirname, ['--bail', '--watch']);

        expect(stderr).toContain(`You are using "bail" with "watch". "bail" will still exit webpack when the first error is found.`);
        expect(stdout).toContain('bail: true');
        expect(stdout).toContain('watch: true');
    });
});
