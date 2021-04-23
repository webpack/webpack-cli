'use strict';

const path = require('path');
// eslint-disable-next-line node/no-unpublished-require
const getPort = require('get-port');
const { runWatch, normalizeStderr, isDevServer4 } = require('../../utils/test-utils');

const testPath = path.resolve(__dirname);

describe('serve variable', () => {
    let port;

    beforeEach(async () => {
        port = await getPort();
    });

    it('compiles without flags and export variable', async () => {
        const { stdout, stderr } = await runWatch(testPath, ['serve', '--port', port]);

        expect(normalizeStderr(stderr)).toMatchSnapshot();
        expect(stdout).toContain('main.js');

        if (isDevServer4) {
            expect(stdout).not.toContain('HotModuleReplacementPlugin');
        } else {
            expect(stdout).not.toContain('HotModuleReplacementPlugin');
        }

        expect(stdout).toContain('PASS');
    });
});
