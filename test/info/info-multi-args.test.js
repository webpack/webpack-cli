'use strict';

const path = require('path');
// eslint-disable-next-line node/no-unpublished-require
const { run } = require('../utils/test-utils');

const runInfo = args => {
    return run(path.resolve(__dirname), ['info'].concat(args), false);
};

describe('info with multiple flags', () => {
    it('gets info about system and browser', async () => {
        const { stdout, stderr } = await runInfo(['--system', '--binaries']);
        expect(stdout).toContain('System:');
        expect(stdout).toContain('Binaries:');
        expect(stderr).toHaveLength(0);
    });

    it('gets only system info as json', async () => {
        const { stdout, stderr } = await runInfo(['-s', '--output-json']);
        expect(stdout).toContain('"System":');
        expect(stderr).toHaveLength(0);
        const parse = () => {
            JSON.parse(stdout);
        };
        expect(parse).not.toThrow();
        expect(parse.System).not.toBeNull();
    });

    it('gets only binary info in markdown', async () => {
        const { stdout, stderr } = await runInfo(['-b', '--output-markdown']);
        expect(stdout).toContain('## Binaries:');
        expect(stdout).not.toContain('## System:');
        expect(stderr).toHaveLength(0);
    });

    it('gets npm packages', async () => {
        const { stderr } = await runInfo(['--npmg', '--npmPackages']);
        expect(stderr).toHaveLength(0);
    });
});
