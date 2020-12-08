'use strict';

const { join } = require('path');
const { runInfo } = require('../utils/test-utils');

describe('basic info usage', () => {
    it('gets info without flags', () => {
        const { exitCode, stdout, stderr } = runInfo([], __dirname);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('System:');
        expect(stdout).toContain('Node');
        expect(stdout).toContain('npm');
        expect(stdout).toContain('Yarn');
    });

    it('gets more info in project root', () => {
        const { exitCode, stderr, stdout } = runInfo([], join(__dirname, '../../'));

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('System:');
        expect(stdout).toContain('Monorepos:');
        expect(stdout).toContain('Packages:');
        expect(stdout).toContain('Node');
        expect(stdout).toContain('npm');
        expect(stdout).toContain('Yarn');
    });

    it('gets info as json', () => {
        const { exitCode, stderr, stdout } = runInfo(['--output="json"'], __dirname);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
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
        const { exitCode, stderr, stdout } = runInfo(['--output="markdown"'], __dirname);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('## System:');
    });

    it('shows a warning if an invalid value is supplied', () => {
        const { exitCode, stderr, stdout } = runInfo(['--output=unknown'], __dirname);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`'unknown' is not a valid value for output`);
        expect(stdout).toBeFalsy();
    });
});
