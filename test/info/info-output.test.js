/* eslint-disable space-before-function-paren */
'use strict';

const path = require('path');
const { run } = require('../utils/test-utils');

const runInfo = args => {
    return run(path.resolve(__dirname), ['info'].concat(args), false);
};

describe('basic info usage', () => {
    it('gets info without flags', async () => {
        const { stdout, stderr } = await runInfo([]);
        // stdout should include many details which will be
        // unique for each computer
        expect(stdout).toContain('System:');
        expect(stderr).toHaveLength(0);
    });

    it('gets info as json', async () => {
        const { stdout, stderr } = await runInfo(['--output-json']);
        expect(stdout).toContain('"System":');
        expect(stderr).toHaveLength(0);

        const parse = () => {
            JSON.parse(stdout);
        };

        expect(parse).not.toThrow();
    });

    it('gets info as markdown', async () => {
        const { stdout, stderr } = await runInfo(['--output-markdown']);
        expect(stdout).toContain('## System:');
        expect(stderr).toHaveLength(0);
    });

    it('gets only specific info', async () => {
        const { stdout, stderr } = await runInfo(['--output-markdown', '--binaries']);
        // system info is not specified as a flag
        expect(stdout).not.toContain('## System:');
        expect(stdout).toContain('## Binaries:');
        expect(stderr).toHaveLength(0);
    });
});
