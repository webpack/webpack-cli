'use strict';

const { run } = require('../../utils/test-utils');

describe('loader warning test', () => {
    it(`should not ignore loader's warning and exit with a non zero exit code`, () => {
        const { stdout, exitCode } = run(__dirname, [], false);

        expect(stdout).toContain('[1 warning]');
        expect(stdout).toContain('This is a warning');
        expect(exitCode).not.toEqual(0);
    });
});
