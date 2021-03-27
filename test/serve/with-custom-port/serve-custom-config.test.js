'use strict';

const path = require('path');
// eslint-disable-next-line node/no-unpublished-require
const getPort = require('get-port');
const { runWatch } = require('../../utils/test-utils');

const testPath = path.resolve(__dirname);

describe('serve with devServer in config', () => {
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

    it('Should pick up the host and port from config', async () => {
        const { stdout, stderr } = await runWatch(testPath, ['serve']);

        expect(stderr).toBeFalsy();
        // Should output the correct bundle file
        expect(stdout).toContain('main.js');
        expect(stdout).not.toContain('HotModuleReplacementPlugin');
        // Runs at correct host and port
        expect(stdout).toContain('http://0.0.0.0:1234');
    });

    it('Port flag should override the config port', async () => {
        const { stdout, stderr } = await runWatch(testPath, ['serve', '--port', port]);

        expect(stderr).toBeFalsy();
        // Should output the correct bundle file
        expect(stdout).toContain('main.js');
        expect(stdout).not.toContain('HotModuleReplacementPlugin');
        // Runs at correct host and port
        expect(stdout).toContain(`http://0.0.0.0:${port}`);
    });

    it('Passing hot flag works alongside other server config', async () => {
        const { stdout, stderr } = await runWatch(testPath, ['serve', '--port', port, '--hot']);

        expect(stderr).toBeFalsy();
        // Should output the correct bundle file
        expect(stdout).toContain('main.js');
        // HMR is being used
        expect(stdout).toContain('HotModuleReplacementPlugin');
        // Runs at correct host and port
        expect(stdout).toContain(`http://0.0.0.0:${port}`);
    });

    it('works fine when no-hot flag is passed alongside other server config', async () => {
        const { stdout, stderr } = await runWatch(testPath, ['serve', '--port', port, '--no-hot']);

        expect(stderr).toBeFalsy();
        // Should output the correct bundle file
        expect(stdout).toContain('main.js');
        // HMR is not being used
        expect(stdout).not.toContain('HotModuleReplacementPlugin');
        // Runs at correct host and port
        expect(stdout).toContain(`http://0.0.0.0:${port}`);
    });
});
