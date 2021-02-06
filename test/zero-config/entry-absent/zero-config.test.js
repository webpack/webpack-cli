'use strict';

const stripAnsi = require('strip-ansi');
const { run } = require('../../utils/test-utils');

describe('Zero Config tests', () => {
    it('runs when config and entry are both absent', () => {
        const { exitCode, stderr, stdout } = run(__dirname, [], false);

        expect(exitCode).toBe(1);
        expect(stderr).toBeFalsy();
        // Entry file is absent, should log the Error from the compiler
        expect(stripAnsi(stdout)).toContain("Error: Can't resolve './src'");
    });
});
