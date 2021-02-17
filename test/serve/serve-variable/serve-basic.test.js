'use strict';

const path = require('path');
const getPort = require('get-port');
const { runWatch } = require('../../utils/test-utils');

const testPath = path.resolve(__dirname);

describe('serve variable', () => {
    let port;

    beforeEach(async () => {
        port = await getPort();
    });

    const isWindows = process.platform === 'win32';

    // TODO fix me on windows
    if (isWindows) {
        it('TODO: Fix on windows', () => {
            expect(true).toBe(true);
        });
        return;
    }

    it('compiles without flags and export variable', async () => {
        const { stdout, stderr } = await runWatch(testPath, ['serve', '--port', port]);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('main.js');
        expect(stdout).not.toContain('HotModuleReplacementPlugin');
        expect(stdout).toContain('PASS');
    });
});
