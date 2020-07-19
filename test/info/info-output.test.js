/* eslint-disable space-before-function-paren */
'use strict';

const { runInfo } = require('../utils/test-utils');

describe('basic info usage', () => {
    it('gets info without flags', () => {
        const { stdout, stderr } = runInfo([], __dirname);
        // stdout should include many details which will be
        // unique for each computer
        expect(stdout).toContain('System:');
        expect(stdout).toContain('Node');
        expect(stdout).toContain('npm');
        expect(stdout).toContain('Yarn');
        expect(stderr).toHaveLength(0);
    });

    it('gets info as json', () => {
        const { stdout, stderr } = runInfo(['--output="json"'], __dirname);
        expect(stdout).toContain('"System":');
        expect(stderr).toHaveLength(0);

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
        const { stdout, stderr } = runInfo(['--output="markdown"'], __dirname);
        expect(stdout).toContain('## System:');
        expect(stderr).toHaveLength(0);
    });
});
