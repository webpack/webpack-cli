'use strict';

const stripAnsi = require('strip-ansi');
const { runInfo } = require('../utils/test-utils');

describe('basic info usage', () => {
    it('gets info without flags', () => {
        const { stdout } = runInfo([], __dirname);
        expect(stdout).toContain('System:');
        expect(stdout).toContain('Node');
        expect(stdout).toContain('npm');
        expect(stdout).toContain('Yarn');
    });

    it('gets info as json', () => {
        const { stdout } = runInfo(['--output="json"'], __dirname);
        expect(stdout).toContain('"System":');

        const parse = () => {
            const output = JSON.parse(stdout);
            expect(output['System']).toBeTruthy();
            expect(output['Binaries']).toBeTruthy();
            expect(output['System']['OS']).toBeTruthy();
            expect(output['System']['CPU']).toBeTruthy();
        };

        expect(parse).not.toThrow();
    });

    it('gets info as markdown', () => {
        const { stdout } = runInfo(['--output="markdown"'], __dirname);
        expect(stdout).toContain('## System:');
    });

    it('shows a warning if an invalid value is supplied', () => {
        const { stdout, stderr, exitCode } = runInfo(['--output=unknown'], __dirname);

        expect(exitCode).toBe(2);
        expect(stripAnsi(stderr)).toContain("[webpack-cli] 'unknown' is not a valid value for output");
        expect(stdout).toBeFalsy();
    });
});
