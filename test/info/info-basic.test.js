/* eslint-disable space-before-function-paren, @typescript-eslint/explicit-function-return-type*/
'use strict';

const path = require('path');
const { runWatch } = require('../utils/test-utils');

const runInfo = args => {
    return runWatch(path.resolve(__dirname, './shim'), ['info'].concat(args), false, 'main');
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
});
