/* eslint-disable space-before-function-paren */
'use strict';

const path = require('path');
const { runWatch } = require('../utils/test-utils');

jest.setTimeout(20000);

const runServe = args => {
    return runWatch(path.resolve(__dirname, './shim'), ['serve'].concat(args), false, 'main');
};

describe('basic serve usage', () => {
    it('compiles without flags', async () => {
        const { stdout, stderr } = await runServe([]);
        expect(stdout).toContain('main.js');
        expect(stdout).not.toContain('hot/dev-server.js');
        expect(stderr).toHaveLength(0);
    });

    it('uses hot flag to alter bundle', async () => {
        const { stdout, stderr } = await runServe(['--hot']);
        expect(stdout).toContain('main.js');
        expect(stdout).toContain('hot/dev-server.js');
        expect(stderr).toHaveLength(0);
    });

    it('uses hot flag to alter bundle', async () => {
        const { stdout, stderr } = await runServe(['--unknown-flag']);
        expect(stdout).toHaveLength(0);
        expect(stderr).toContain('Unknown option: --unknown-flag');
    });
});
