/* eslint-disable space-before-function-paren */
'use strict';

const path = require('path');
const { run } = require('../utils/test-utils');

const runInfo = (args) => {
    return run(path.resolve(__dirname), ['info'].concat(args), false);
};

describe('basic info usage', () => {
    it('gets info without flags', async () => {
        const { stdout, stderr } = await runInfo([]);
        // stdout should include many details which will be
        // unique for each computer
        expect(stdout).toContain('System:');
        expect(stdout).toContain('Node');
        expect(stdout).toContain('npm');
        expect(stdout).toContain('Yarn');
        expect(stderr).toHaveLength(0);
    });

    it('gets info as json', async () => {
        const { stdout, stderr } = await runInfo(['--output="json"']);
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

    it('gets info as markdown', async () => {
        const { stdout, stderr } = await runInfo(['--output="markdown"']);
        expect(stdout).toContain('## System:');
        expect(stderr).toHaveLength(0);
    });
});
