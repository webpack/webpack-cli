'use strict';

const path = require('path');
const { runWatch } = require('../utils/test-utils');

jest.setTimeout(20000);

const runServe = args => {
    return runWatch(path.resolve(__dirname, '../config/serve-basic'), ['serve'].concat(args), false, 'main');
};

describe('basic serve usage', () => {
    // eslint-disable-next-line space-before-function-paren
    it('compiles without flags', async () => {
        const { stdout, stderr } = await runServe([]);
        expect(stdout).toContain('bundle.js');
        expect(stdout).not.toContain('hot/dev-server.js');
        expect(stderr).toHaveLength(0);
    });
    // eslint-disable-next-line space-before-function-paren
    it('uses hot flag to alter bundle', async () => {
        const { stdout, stderr } = await runServe(['--hot']);
        expect(stdout).toContain('bundle.js');
        expect(stdout).toContain('hot/dev-server.js');
        expect(stderr).toHaveLength(0);
    });
    // eslint-disable-next-line space-before-function-paren
    it('uses hot flag to alter bundle', async () => {
        const { stdout, stderr } = await runServe(['--unknown-flag']);
        expect(stdout).toHaveLength(0);
        expect(stderr).toContain('Unknown option: --unknown-flag');
    });
});
